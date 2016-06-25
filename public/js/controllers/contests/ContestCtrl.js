angular.module('Contests')
  .controller('ContestController', [
    '$scope',
    '$state',
    '$stateParams',
    '$mdSidenav',
    'ContestAPI',
    'TimeState',
    function ($scope, $state, $stateParams, $mdSidenav, ContestAPI, TimeState) {
      if ($state.is('contest')) {
        $state.go('.scoreboard')
      }
      $scope.state = $state
      $scope.timeState = TimeState

      $scope.canViewContest = false
      $scope.loading = true

      $scope.id = $stateParams.id
      $scope.contest = {}
      // Submit
      $scope.submission = {}
      // Submissions
      $scope.submissions = []
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

      $scope.toggleRight = function(contest) {
  			$mdSidenav('join-contest-sidenav').toggle()
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

            if (data.inContest) {
              fetchSubmissions()
            }
            if (new Date() >= data.date_start) {
              fetchContestScoreboard()
            }
          } else {
            $scope.loading = false
          }
        })
      }

      function fetchContestScoreboard(upTo) {
        ContestAPI.getContestEvents($scope.id, function(err, events) {
          if (err || !events) return
          _.forEach(events, function(e) {
            var rep = e[0], pid = e[1], status = e[2], timestamp = e[3]
            _.update($scope.scoreboard, [rep, pid], function(o) {
              o = o || {err: 0, pending: 0, accepted: false}
              if (!o.accepted) {
                if (status === 'ACCEPTED') {
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
              }
              return o
            })
          })
          $scope.contestantsIds.sort(function(a,b) {
            var solvedA = $scope.scores[a] && $scope.scores[a].solved || 0
            var solvedB = $scope.scores[b] && $scope.scores[b].solved || 0
            if (solvedA != solvedB) return solvedB - solvedA
            var penaltyA = $scope.scores[a] && $scope.scores[a].penalty || 0
            var penaltyB = $scope.scores[b] && $scope.scores[b].penalty || 0
            return penaltyA - penaltyB
          })
          $scope.loading = false
        })
      }

      $scope.pushSubmission = function(submission) {
        submission.date = new Date(submission.date)
        submission.minutes = Math.floor((submission.date - $scope.contest.date_start) / 60000)
        submission.index = $scope.problemIndex[submission.problem]
        $scope.submissions.push(submission)
      }

      function fetchSubmissions() {
        ContestAPI.getSubmissions($scope.id, function(err, submissions) {
          _.forEach(submissions, function(value) {
            $scope.pushSubmission(value)
          })
        })
      }

      fetchContestMetadata()
    }
  ])
