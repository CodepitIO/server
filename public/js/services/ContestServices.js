angular.module('Contests')
  .service('ContestState', [
    function () {
      var $scope = this
      $scope.submission = {}
      $scope.reset = function () {
        $scope.submission = {
          language: null,
          code: '',
          codefile: null
        }
        $scope.data = {}
      }
    }
  ])
  .service('SettingsState', [
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
