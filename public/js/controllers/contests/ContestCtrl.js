angular.module('Contests')
  .controller('ContestController', [
    '$scope',
    '$state',
    '$stateParams',
    '$mdSidenav',
    '$interval',
    'Notification',
    'ContestAPI',
    'TimeState',
    'UserState',
    'Verdict',
    function ($scope, $state, $stateParams, $mdSidenav, $interval, Notification, ContestAPI, TimeState, UserState, Verdict) {
      if ($state.is('contest')) {
        $state.go('.scoreboard')
      }
      $scope.state = $state
      $scope.timeState = TimeState
      $scope.userState = UserState

      $scope.canViewContest = false
      $scope.loading = true

      $scope.id = $stateParams.id
      $scope.contest = {}
      // Submit
      $scope.submission = {}
      // Submissions
      $scope.submissions = {}
      $scope.submissionsIds = []
      // Scoreboard
      $scope.problems = []
      $scope.problemIndex = {}
      $scope.contestantsIds = []
      $scope.contestants = {}

      $scope.scoreboard = {}
      $scope.scores = {}
      $scope.firstAccepted = {}

      $scope.displayTop = function() {
        var current = TimeState.server.dynamic
        return current >= $scope.contest.date_start &&
          current < $scope.contest.date_end
      }

      $scope.getPercentage = function() {
        var perc =
          100 * (TimeState.server.dynamic - $scope.contest.date_start) /
          ($scope.contest.date_end - $scope.contest.date_start)
        return perc
      }

      function getReps(contestants) {
        return _.chain(contestants)
          .groupBy(function(o) {
            return o.team && o.team._id || o.id && o.id._id;
          })
          .map(function(o) {
            if (o[0].team) {
              return {
                id: o[0].team._id,
                name: o[0].team.name,
                handles: _.map(o, function(e) { return [e.id._id, e.id.local.username] })
              }
            } else {
              return {id: o[0].id._id, name: o[0].id.local.username}
            }
          })
          .keyBy(function(o) {
            return o.id
          })
          .value()
      }

      function fetchContestMetadata() {
        ContestAPI.getContestMetadata($scope.id, function(err, data) {
          if (err || !data) return
          data.date_start = new Date(data.date_start)
          data.date_end = new Date(data.date_end)
          data.frozen_time = new Date(data.frozen_time)
          data.blind_time = new Date(data.blind_time)
          $scope.contest = data
          $scope.canViewContest = data.canViewContest
          if (data.canViewContest) {
            _.forEach(data.problems, function(value, key) {
              $scope.problemIndex[value._id] = key
            })
            $scope.problems = data.problems
            $scope.contestants = getReps(data.contestants)
            $scope.contestantsIds = _.keys($scope.contestants)

            if (new Date() >= data.date_start) {
              if (data.inContest) {
                processSubmissions()
              }
              processContestEvents(function() {
                $scope.loading = false
              })
            }
          } else {
            $scope.loading = false
          }
        })
      }

      function sortContestants(callback) {
        $scope.contestantsIds.sort(function(a,b) {
          var solvedA = $scope.scores[a] && $scope.scores[a].solved || 0
          var solvedB = $scope.scores[b] && $scope.scores[b].solved || 0
          if (solvedA != solvedB) return solvedB - solvedA
          var penaltyA = $scope.scores[a] && $scope.scores[a].penalty || 0
          var penaltyB = $scope.scores[b] && $scope.scores[b].penalty || 0
          return penaltyA - penaltyB
        })
        callback && callback()
      }

      var eventStartFrom = 0, markEvent = {}, pending = {}
      function processContestEvents(callback) {
        var newEventStartFrom = eventStartFrom
        ContestAPI.getContestEvents($scope.id, eventStartFrom, function(err, events) {
          var shouldSort = !!callback
          events = events || []
          if (events.length > 0) newEventStartFrom = _.last(events)[3]+1
          _.forEach(events, function(e) {
            var rep = e[0], pid = e[1], status = e[2], timestamp = e[3]
            var pendingKey = _.join([rep,pid,timestamp], ',')
            if (status === 'PENDING') {
              newEventStartFrom = Math.min(newEventStartFrom, timestamp)
              pending[pendingKey] = true
            }
            var uid = _.join(e, ',')
            if (markEvent[uid]) return
            markEvent[uid] = true
            _.update($scope.scoreboard, [rep, pid], function(o) {
              o = o || {err: 0, pending: 0, accepted: false}
              if (status !== 'PENDING' && pending[pendingKey]) {
                delete pending[pendingKey]
                o.pending--
              }
              if (o.accepted) return o
              if (status === 'ACCEPTED') {
                shouldSort = true
                o.accepted = true
                o.time = Math.floor((timestamp - $scope.contest.date_start.getTime()) / 60000)
                _.update($scope.firstAccepted, pid, function(s) {
                  if (s) return s
                  return { rep: rep, timestamp: timestamp }
                })
                _.update($scope.scores, rep, function(s) {
                  s = s || {solved: 0, penalty: 0}
                  s.solved++
                  s.penalty += o.time + o.err * 20
                  return s
                })
              } else if (status === 'REJECTED') {
                o.err++
              } else {
                o.pending++
              }
              return o
            })
          })
          if (shouldSort) sortContestants(callback)
          eventStartFrom = newEventStartFrom
        })
      }

      var submissionStartFrom = 0
      function processSubmissions() {
        var newSubmissionStartFrom = submissionStartFrom
        ContestAPI.getSubmissions($scope.id, submissionStartFrom, function(err, submissions) {
          if (submissions.length > 0) {
            newSubmissionStartFrom = new Date(_.head(submissions).date).getTime()+1
          }
          _.forEach(submissions, function(s) {
            if (s.verdict <= 0) {
              newSubmissionStartFrom =
                Math.min(newSubmissionStartFrom, new Date(s.date).getTime())
            }
            $scope.tryPushSubmission(s)
          })
          submissionStartFrom = newSubmissionStartFrom
        })
      }

      var processInterval = $interval(function() {
        processContestEvents()
        processSubmissions()
      }, 5000, 0, false)
      $scope.$on('$destroy', function() {
        $interval.cancel(processInterval)
      })

      $scope.tryPushSubmission = function(s) {
        if ($scope.submissions[s._id]) {
          var olds = $scope.submissions[s._id]
          if (olds.verdict <= 0 && s.verdict > 0) {
            Notification[Verdict[s.verdict].notification](
              'Problema ' + String.fromCharCode(65 + olds.index) + ': ' + Verdict[s.verdict].text
            )
          }
          return olds.verdict = s.verdict
        }
        s.date = new Date(s.date)
        s.minutes = Math.floor((s.date - $scope.contest.date_start) / 60000)
        s.index = $scope.problemIndex[s.problem]
        $scope.submissions[s._id] = s
        $scope.submissionsIds.unshift(s._id)
      }

      fetchContestMetadata()

      $scope.toggleRight = function(contest) {
  			$mdSidenav('join-contest-sidenav').toggle()
  		}

      $scope.leave = function() {
        ContestAPI.leave($scope.id)
      }
    }
  ])
