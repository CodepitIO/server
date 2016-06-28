angular.module('User')
  .controller('ProfileTeamsController', [
    '$scope',
    '$mdDialog',
    'TeamAPI',
    function ($scope, $mdDialog, TeamAPI) {
      $scope.member = []
      $scope.invited = []
      $scope.loading = true
      TeamAPI.getByLoggedUser(function(err, teams) {
        $scope.member = teams.member
        $scope.invited = teams.invited
        $scope.loading = false
      })

      $scope.newTeam = function(ev) {
        var confirm = $mdDialog.prompt()
          .title('Criar time')
          .clickOutsideToClose(true)
          .placeholder('Nome do time')
          .targetEvent(ev)
          .ok('Criar')
          .cancel('Cancelar')
        $mdDialog.show(confirm).then(function(name) {
          TeamAPI.create(name)
        })
      }
    }
  ])
