angular.module('Contests')
  .controller('ContestController', [
    '$scope',
    '$state',
    '$mdSidenav',
    'ContestAPI',
    'ContestState',
    'UserState',
    function ($scope, $state, $mdSidenav, ContestAPI, ContestState, UserState) {
      $scope.state = $state
      $scope.UserState = UserState
      $scope.ContestState = ContestState

      ContestState.start()

      $scope.toggleRight = function(contest) {
  			$mdSidenav('join-contest-sidenav').toggle()
  		}

      $scope.leave = function() {
        ContestAPI.leave(ContestState.id)
      }
    }
  ])
