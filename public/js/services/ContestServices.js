var app = angular.module('Contests')

app.service('ContestState', [
  'ContestAPI',
  function (ContestAPI) {
    var $scope = this

    var scores = {}, scoreboard = {}, firstAccepted = {}
    $scope.reset = function (id) {
      $scope.canViewContest = false
      $scope.loading = true

      $scope.id = id
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

      scoreboard = {}
      scores = {}
      contestants = {}
      firstAccepted = {}

      fetchContestMetadata()
    }

    $scope.pushSubmission = function(submission) {
      submission.date = new Date(submission.date)
      submission.minutes = Math.floor((submission.date - $scope.contest.date_start) / 60000)
      submission.index = $scope.problemIndex[submission.problem]
      $scope.submissions.push(submission)
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
          _.update(scoreboard, [rep, pid], function(o) {
            o = o || {err: 0, pending: 0, accepted: false}
            if (!o.accepted) {
              if (status === 'ACCEPTED') {
                o.accepted = true
                o.time = Math.floor((timestamp - $scope.contest.date_start.getTime()) / 60000)
                _.update(firstAccepted, pid, function(s) {
                  if (s) return s
                  return { rep: rep, timestamp: timestamp }
                })
                _.update(scores, rep, function(s) {
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
          var solvedA = scores[a] && scores[a].solved || 0
          var solvedB = scores[b] && scores[b].solved || 0
          if (solvedA != solvedB) return solvedB - solvedA
          var penaltyA = scores[a] && scores[a].penalty || 0
          var penaltyB = scores[b] && scores[b].penalty || 0
          return penaltyA - penaltyB
        })
        $scope.loading = false
      })
    }

    $scope.getCellAttempts = function(rep, problem) {
      var score = _.get(scoreboard, [rep, problem])
      if (!score) return ''
      return score.err + 1
    }
    $scope.getCellPenalty = function(rep, problem) {
      var score = _.get(scoreboard, [rep, problem])
      if (!score) return ''
      return (score.accepted) ? score.time : '--'
    }
    $scope.getCellClass = function(rep, problem) {
      var score = _.get(scoreboard, [rep, problem])
      if (!score) return ''
      var cls = ''
      if (score.accepted) {
        cls = 'accepted-cell'
        if (firstAccepted[problem].rep === rep) cls += ' first-accepted'
        return cls
      }
      if (score.pending > 0) cls += 'pending-cell '
      if (score.err > 0) cls += 'rejected-cell '
      return cls
    }

    $scope.getRowResults = function(rep, type) {
      return _.get(scores, [rep, type], '0')
    }

    function fetchSubmissions() {
      ContestAPI.getSubmissions($scope.id, function(err, submissions) {
        _.forEach(submissions, function(value) {
          $scope.pushSubmission(value)
        })
      })
    }
  }
])
