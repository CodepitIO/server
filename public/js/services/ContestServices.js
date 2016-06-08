var app = angular.module('Contests')

app.service('ContestState', [
  'ContestFacade',
  'UserState',
  'SocketState',
  function (contest, userState, socketState) {
    var $scope = this
    $scope.submission = {}
    $scope.submissions = []
    $scope.contest = {}
    $scope.problemIndex = {}

    $scope.reset = function (id) {
      $scope.id = id
      socketState.join(id)
      $scope.submission = {}
      $scope.contest = {}
      fetchContestData()
    }

    $scope.pushSubmission = function(submission) {
      submission.date = new Date(submission.date)
      submission.minutes = Math.floor((submission.date - $scope.contest.date_start) / 60000)
      submission.index = $scope.problemIndex[submission.problem]
      $scope.submissions.push(submission)
    }

    function fetchContestData() {
      contest.getContestData($scope.id, function(err, data) {
        if (err || !data) return
        data.date_start = new Date(data.date_start)
        data.date_end = new Date(data.date_end)
        data.frozen_time = new Date(data.frozen_time)
        data.blind_time = new Date(data.blind_time)
        $scope.contest = data
        _.forEach(data.problems, function(value, key) {
          $scope.problemIndex[value._id] = key
         })
        if (data.inContest) {
          fetchSubmissions()
        }
      })
    }

    function fetchSubmissions() {
      contest.getSubmissions($scope.id, function(err, submissions) {
        _.forEach(submissions, function(value) {
          $scope.pushSubmission(value)
        })
      })
    }

    function getVerdictByTimestamp(timestamp) {
      contest.getVerdictByTimestamp($scope.id, new Date(timestamp), function(err, submission) {
        if (submission) {
          _.forEach($scope.submissions, function(val) {
            if (val._id === submission._id) {
              val.verdict = submission.verdict
              return false
            }
          })
        }
      })
    }

    socketState.socket.on('submission', function(submission) {
      if (userState.user && submission.contestant === userState.user._id) {
        getVerdictByTimestamp(submission.date)
      }
    })
  }
])

app.service('SettingsState', [
  function () {
    var $scope = this
    $scope.contest = {
      problems: [],
      options: {
        hasFrozen: false,
        hasBlind: false,
        isPrivate: false,
        watchPrivate: false,
        penalty: 20,
      }
    }
    $scope.tab = 0
    $scope.nextTab = function() {
      $scope.tab = $scope.tab+1
    }

    $scope.validateTimeRange = function() {
      if ($scope.contest.date_start) {
        $scope.contest.date_start = Math.max($scope.contest.date_start, new Date())
      }
      if ($scope.contest.date_end) {
        $scope.contest.date_end = Math.max($scope.contest.date_end, new Date())
      }
      if (!$scope.contest.date_start || !$scope.contest.date_end) {
        $scope.contest.options.hasFrozen = $scope.contest.options.hasBlind = false
        return
      }

      $scope.contest.date_end = Math.max(
        $scope.contest.date_start,
        $scope.contest.date_end
      )
      if (!$scope.contest.options.hasFrozen) {
        $scope.contest.frozen_time = $scope.contest.date_end - 60 * 60 * 1000
      }
      if (!$scope.contest.options.hasBlind) {
        $scope.contest.blind_time = $scope.contest.date_end - 15 * 60 * 1000
      }

      $scope.contest.frozen_time = Math.max($scope.contest.frozen_time, $scope.contest.date_start)
      $scope.contest.frozen_time = Math.min($scope.contest.frozen_time, $scope.contest.date_end)

      $scope.contest.blind_time = Math.max($scope.contest.blind_time, $scope.contest.date_start)
      $scope.contest.blind_time = Math.min($scope.contest.blind_time, $scope.contest.date_end)

      if ($scope.contest.blind_time <= $scope.contest.frozen_time && $scope.contest.options.hasFrozen && $scope.contest.options.hasBlind) {
        $scope.contest.frozen_time = $scope.contest.blind_time
      }
    }

    $scope.debounceValidation = _.debounce($scope.validateTimeRange, 500)
  }
])
