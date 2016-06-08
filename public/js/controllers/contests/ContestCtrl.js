angular.module('Contests')
  .controller('ContestController', [
    '$scope',
    '$state',
    '$stateParams',
    'TimeState',
    'ContestState',
    function ($scope, $state, $stateParams, timeState, contestState) {
      // Redirect to scoreboard when in path /contest
      if ($state.is('contest')) {
        $state.go('.scoreboard')
      }
      $scope.state = $state
      $scope.contestState = contestState
      $scope.timeState = timeState

      contestState.reset($stateParams.id)

      $scope.displayTop = function() {
        var current = timeState.server.dynamic
        return current >= contestState.contest.date_start &&
          current < contestState.contest.date_end
      }

      $scope.getPercentage = function() {
        var perc =
          100 * (timeState.server.dynamic - contestState.contest.date_start) /
          (contestState.contest.date_end - contestState.contest.date_start)
        return perc
      }
    }
  ])
