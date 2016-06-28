angular.module('Contests')
  .controller('ContestJoinController', [
    '$scope',
    '$mdSidenav',
    'TeamAPI',
    'ContestAPI',
    function($scope, $mdSidenav, TeamAPI, ContestAPI) {
      $scope.password = ''
      $scope.team = null
      if ($scope.contest.contestantType === 1) {
        $scope.role = 'individual'
      } else if ($scope.contest.contestantType === 2) {
        $scope.role = 'team'
      }

      $scope.teams = []
      TeamAPI.getByLoggedUser(function(err, data) {
        $scope.teams = data.member
      })

      $scope.close = function() {
        $mdSidenav('join-contest-sidenav').close()
      }

      $scope.join = function() {
        var team = ($scope.role === 'individual') ? null : $scope.team
        ContestAPI.join($scope.id, $scope.password, team)
      }
    }
  ])
