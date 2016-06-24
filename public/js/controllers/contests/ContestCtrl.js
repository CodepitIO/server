angular.module('Contests')
  .controller('ContestController', [
    '$scope',
    '$state',
    '$stateParams',
    '$mdSidenav',
    'TimeState',
    'ContestState',
    function ($scope, $state, $stateParams, $mdSidenav, timeState, ContestState) {
      // Redirect to scoreboard when in path /contest
      if ($state.is('contest')) {
        $state.go('.scoreboard')
      }
      $scope.state = $state
      $scope.ContestState = ContestState
      $scope.timeState = timeState

      ContestState.reset($stateParams.id)

      $scope.displayTop = function() {
        var current = timeState.server.dynamic
        return current >= ContestState.contest.date_start &&
          current < ContestState.contest.date_end
      }

      $scope.getPercentage = function() {
        var perc =
          100 * (timeState.server.dynamic - ContestState.contest.date_start) /
          (ContestState.contest.date_end - ContestState.contest.date_start)
        return perc
      }

      $scope.toggleRight = function(contest) {
  			$mdSidenav('join-contest-sidenav').toggle()
  		}
    }
  ])
