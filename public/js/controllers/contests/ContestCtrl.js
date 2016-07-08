angular.module('Contests')
  .controller('ContestController', [
    '$scope',
    '$state',
    '$stateParams',
    '$mdSidenav',
    'ContestAPI',
    'ContestState',
    'UserState',
    function ($scope, $state, $stateParams, $mdSidenav, ContestAPI, ContestState, UserState) {
      if ($state.is('contest')) {
        $state.go('.scoreboard')
      }
      $scope.state = $state
      $scope.UserState = UserState
      $scope.ContestState = ContestState

      $scope.id = $stateParams.id

      ContestState.start($scope.id)

      $scope.toggleRight = function(contest) {
  			$mdSidenav('join-contest-sidenav').toggle()
  		}

      $scope.leave = function() {
        ContestAPI.leave($scope.id)
      }
    }
  ])
