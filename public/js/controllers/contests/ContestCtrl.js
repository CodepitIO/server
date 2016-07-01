angular.module('Contests')
  .controller('ContestController', [
    '$scope',
    '$state',
    '$stateParams',
    '$mdSidenav',
    '$interval',
    'Notification',
    'ContestAPI',
    'UserState',
    'TimeState',
    'Verdict',
    function ($scope, $state, $stateParams, $mdSidenav, $interval, Notification, ContestAPI, UserState, TimeState, Verdict) {
      if ($state.is('contest')) {
        $state.go('.scoreboard')
      }
      $scope.state = $state
      $scope.userState = UserState

      $scope.canViewContest = false
      $scope.loading = true

      $scope.id = $stateParams.id
      $scope.contest = {}
      $scope.editContest = {}
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

      var currentProblemsHash = null, currentContestants = []
      function processContestMetadata() {
        ContestAPI.getContestMetadata($scope.id, function(err, data) {
          if (err || !data) return
          data.date_start = new Date(data.date_start)
          data.date_end = new Date(data.date_end)
          data.frozen_time = new Date(data.frozen_time)
          data.blind_time = new Date(data.blind_time)
          data.hasFrozen = data.frozen_time < data.date_end
          data.hasBlind = data.blind_time < data.date_end
          $scope.contest = data
          if (!$scope.editContest.name) {
            _.assign($scope.editContest, $scope.contest)
            delete $scope.editContest.contestants
            $scope.editContest.hasFrozen = data.frozen_time < data.date_end
            $scope.editContest.hasBlind = data.blind_time < data.date_end
            $scope.editContest.allowIndividual = data.contestantType !== 2
            $scope.editContest.allowTeam = data.contestantType !== 1
            $scope.date_start = data.date_start
          }
          $scope.canViewContest = data.canViewContest
          if (data.canViewContest) {
            var problemsHash = _.join(_.map(data.problems, function(o) { return o._id }), ',')
            if (currentProblemsHash && currentProblemsHash != problemsHash) {
              $state.go($state.current, {id: $scope.id}, {reload: true})
            }
            currentProblemsHash = problemsHash
            _.forEach(data.problems, function(value, key) {
              $scope.problemIndex[value._id] = key
            })
            $scope.problems = data.problems

            if (!_.isEqual(currentContestants, data.contestants)) {
              currentContestants = data.contestants
              $scope.contestants = getReps(currentContestants)
              $scope.contestantsIds = _.keys($scope.contestants)
              sortContestants()
            }

            if (TimeState.server.now >= data.date_start) {
              processContestEvents()
              if (data.inContest) processSubmissions()
            }
          } else {
            $scope.loading = false
          }
        })
      }

      function sortContestants() {
        $scope.contestantsIds.sort(function(a,b) {
          var solvedA = $scope.scores[a] && $scope.scores[a].solved || 0
          var solvedB = $scope.scores[b] && $scope.scores[b].solved || 0
          if (solvedA != solvedB) return solvedB - solvedA
          var penaltyA = $scope.scores[a] && $scope.scores[a].penalty || 0
          var penaltyB = $scope.scores[b] && $scope.scores[b].penalty || 0
          return penaltyA - penaltyB
        })
        $scope.loading = false
      }

      var eventStartFrom = 0, markEvent = {}, pending = {}
      function processContestEvents() {
        var newEventStartFrom = eventStartFrom
        ContestAPI.getContestEvents($scope.id, eventStartFrom, function(err, events) {
          var shouldSort = false
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
          if (shouldSort) sortContestants()
          else if ($scope.loading) $scope.loading = false
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

      processContestMetadata()
      var processInterval = $interval(processContestMetadata, 3000, 0, false)
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


      $scope.toggleRight = function(contest) {
  			$mdSidenav('join-contest-sidenav').toggle()
  		}

      $scope.leave = function() {
        ContestAPI.leave($scope.id)
      }
    }
  ])
