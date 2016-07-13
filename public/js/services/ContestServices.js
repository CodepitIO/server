angular.module('Contests')
  .service('ContestState', function ($state, $stateParams, $interval, Notification, ContestAPI, Verdict) {
      var $scope = this

      $scope.loading = true
      $scope.id = null
      var eventStartFrom,
          markEvent,
          pending,
          currentProblemsHash,
          currentContestants,
          startTimestamp,
          submissionStartFrom,
          processInterval,
          processing
      function reset() {
        $scope.id = null
        $scope.contest = {}
        $scope.editContest = {}
        // Submit
        $scope.submit = {}
        // Submissions
        $scope.submissions = {}
        $scope.submissionsIds = []
        $scope.loadedSubmissions = false
        // Scoreboard
        $scope.problems = []
        $scope.problemIndex = {}
        $scope.contestantsIds = []
        $scope.contestants = {}

        $scope.scoreboard = {}
        $scope.scores = {}
        $scope.firstAccepted = {}
        $scope.canViewContest = false
        $scope.loading = true
        eventStartFrom = 0
        markEvent = {}
        pending = {}
        currentProblemsHash = null
        currentContestants = []
        startTimestamp = 0
        submissionStartFrom = 0
        processInterval = null
        processing = false
      }
      reset()

      function isActive() {
        return $state.includes('contest')
      }

      function getContestantRows(contestants) {
        return _.chain(contestants)
          .groupBy(function(o) {
            return o.team && o.team._id || o.id && o.id._id;
          })
          .map(function(o) {
            if (o[0].team) {
              return {
                id: o[0].team._id,
                name: o[0].team.name,
                handles: _.map(o, function(e) { return e.id && [e.id._id, e.id.local.username] || [] })
              }
            } else {
              if (o[0].id) return {id: o[0].id._id, name: o[0].id.local.username}
              else return {}
            }
          })
          .keyBy(function(o) {
            return o.id
          })
          .value()
      }

      function processContestMetadata(callback) {
        ContestAPI.getContestMetadata($scope.id, function(err, data) {
          if (err || !data || !isActive()) return callback && callback()
          data.date_start = new Date(data.date_start)
          data.date_end = new Date(data.date_end)
          data.frozen_time = new Date(data.frozen_time)
          data.blind_time = new Date(data.blind_time)
          data.hasFrozen = data.frozen_time < data.date_end
          data.hasBlind = data.blind_time < data.date_end
          var now = new Date()
          if (now >= data.frozen_time && now < data.blind_time) data.isFrozen = true
          else if (now >= data.blind_time && now < data.date_end) data.isBlind = true
          if (now >= data.date_start && now < data.date_end) data.isRunning = true
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
            if (!data.hasStarted) data.problems = []
            var problemsHash = _.join(_.map(data.problems, function(o) { return o._id }), ',')
            if (currentProblemsHash) {
              if (currentProblemsHash != problemsHash || startTimestamp != data.date_start.getTime()) {
                return $state.go($state.current, {id: $scope.id}, {reload: true})
              }
            } else {
              currentProblemsHash = problemsHash
              startTimestamp = data.date_start.getTime()
              _.forEach(data.problems, function(value, key) {
                $scope.problemIndex[value._id] = key
              })
              $scope.problems = data.problems
            }
            if (!_.isEqual(currentContestants, data.contestants)) {
              currentContestants = data.contestants
              $scope.contestants = getContestantRows(currentContestants)
              $scope.contestantsIds = _.keys($scope.contestants)
              sortContestants()
            }
            processContestEvents(callback)
            if (data.inContest) processSubmissions()
          } else {
            callback()
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

      function processContestEvents(callback) {
        var newEventStartFrom = eventStartFrom
        ContestAPI.getContestEvents($scope.id, eventStartFrom, function(err, events) {
          if (!isActive()) return callback && callback()
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
          eventStartFrom = newEventStartFrom
          if (shouldSort) sortContestants(callback)
          else callback && callback()
        })
      }

      function processSubmissions() {
        var newSubmissionStartFrom = submissionStartFrom
        ContestAPI.getSubmissions($scope.id, submissionStartFrom, function(err, submissions) {
          if (!isActive()) return
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
          $scope.loadedSubmissions = true
        })
      }

      $scope.tryPushSubmission = function(s) {
        if (s.problem && $scope.problemIndex[s.problem] === undefined) return
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
        if (s.problem) s.index = $scope.problemIndex[s.problem]
        $scope.submissions[s._id] = s
        $scope.submissionsIds.unshift(s._id)
      }

      $scope.start = function() {
        $interval.cancel(processInterval)
        reset()
        $scope.id = $stateParams.id
        processing = true
        processContestMetadata(function() {
          $scope.loading = processing = false
        })
        processInterval = $interval(function() {
          if (!processing && isActive()) {
            processing = true
            processContestMetadata(function() { processing = false })
          }
        }, 3000, 0, false)
      }
    })
