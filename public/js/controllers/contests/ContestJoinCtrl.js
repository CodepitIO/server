angular.module('Contests')
  .controller('ContestJoinController', function($scope, $mdSidenav, UserAPI, ContestAPI, ContestState) {
      $scope.password = ''
      $scope.team = null
      if (ContestState.contest.contestantType === 1) {
        $scope.role = 'individual'
      } else if (ContestState.contest.contestantType === 2) {
        $scope.role = 'team'
      }

      $scope.teams = []
      UserAPI.teams(function(err, data) {
        $scope.teams = data.member
      })

      $scope.close = function() {
        $mdSidenav('join-contest-sidenav').close()
      }

      $scope.join = function() {
        var team = ($scope.role === 'individual') ? null : $scope.team
        ContestAPI.join(ContestState.id, $scope.password, team)
      }
    })
