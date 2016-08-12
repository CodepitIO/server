angular.module('Contests')
  .controller('ContestJoinController', function($scope, $mdSidenav, UserAPI, ContestAPI, ContestState) {
      $scope.password = ''
      $scope.team = null
      $scope.role = 'individual'
      $scope.loading = false

      $scope.isTeam = function() {
        return ContestState.contest.contestantType === 2 || $scope.role === 'team'
      }

      $scope.teams = []
      UserAPI.teams(function(err, data) {
        $scope.teams = data.member
      })

      $scope.close = function() {
        $mdSidenav('join-contest-sidenav').close()
      }

      $scope.join = function() {
        if (ContestState.contest.contestantType === 2) $scope.role = 'team'
        var team = ($scope.role === 'individual') ? null : $scope.team
        $scope.loading = true
        ContestAPI.join(ContestState.id, $scope.password, team, function() {
          $scope.loading = false
        })
      }
    })
