angular.module('Team')
  .controller('TeamController', function ($scope, $stateParams, $mdDialog, $mdMedia, TeamAPI, UserState) {
      $scope.isUser = UserState.isUser;
      $scope.id = $stateParams.id
      $scope.loading = true
      TeamAPI.get($scope.id, function(err, team) {
        $scope.team = team
        $scope.loading = false
        $scope.inTeam = UserState.isInArray(team.members)
      })

      var originatorEv;
      $scope.openMenu = function($mdOpenMenu, ev) {
        originatorEv = ev;
        $mdOpenMenu(ev);
      };

      $scope.remove = function(userId) {
        TeamAPI.remove($scope.id, userId, function() {
          _.remove($scope.team.members, function(usr) { return usr._id === userId })
          _.remove($scope.team.invites, function(usr) { return usr._id === userId })
          $scope.inTeam = UserState.isInArray($scope.team.members)
        })
      }

      $scope.accept = function(user) {
        TeamAPI.accept($scope.id, function() {
          _.remove($scope.team.invites, UserState.isUser)
          $scope.team.members.push(user)
          $scope.inTeam = UserState.isInArray($scope.team.members)
        })
      }

      $scope.decline = function() {
        TeamAPI.decline($scope.id, function() {
          _.remove($scope.team.invites, UserState.isUser)
        })
      }

      $scope.invite = function(ev) {
        var confirm = $mdDialog.prompt()
          .title('Convidar Membro')
          .clickOutsideToClose(true)
          .placeholder('E-mail')
          .targetEvent(ev)
          .ok('Confirmar')
          .cancel('Cancelar')
        $mdDialog.show(confirm).then(function(email) {
          TeamAPI.invite($scope.id, email, function(err, invited) {
            $scope.team.invites.push(invited)
          })
        })
      }

      $scope.edit = function(ev) {
        $mdDialog.show({
          controller: 'EditTeamDialogController',
          locals: { ScopeData: $scope.team },
          templateUrl: 'views/team/edit.dialog.html',
          targetEvent: ev,
          clickOutsideToClose: true,
          fullscreen: ($mdMedia('sm') || $mdMedia('xs'))
        }).then(function(team) {
          $scope.team.name = team.name
          $scope.team.description = team.description
        })
      }
    })
  .controller('EditTeamDialogController', function($scope, $mdDialog, ScopeData, TeamAPI) {
      $scope.team = {
        id: ScopeData._id,
        name: ScopeData.name,
        description: ScopeData.description
      }

      $scope.edit = function() {
        TeamAPI.edit($scope.team);
        $mdDialog.hide($scope.team)
      }

      $scope.cancel = function() {
        $mdDialog.cancel()
      }
    })
