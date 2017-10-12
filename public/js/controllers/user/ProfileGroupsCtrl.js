angular.module('User')
.controller('ProfileGroupsController', function ($scope, $mdDialog, TeamAPI, UserAPI) {
  $scope.member = []
  $scope.invited = []
  $scope.loading = true
  UserAPI.teams(function(err, teams) {
    $scope.member = teams.member
    $scope.invited = teams.invited
    $scope.loading = false
  })

  $scope.newTeam = function(ev) {
    $mdDialog.show({
      controller: DialogController,
      templateUrl: 'views/misc/groups.create.dialog.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true
    })
    .then(function(answer) {
      $scope.status = 'You said the information was "' + answer + '".';
    }, function() {
      $scope.status = 'You cancelled the dialog.';
    });
  }

  function DialogController($scope, $mdDialog) {
    $scope.hide = function() {
      $mdDialog.hide();
    };

    $scope.cancel = function() {
      $mdDialog.cancel();
    };

    $scope.answer = function(answer) {
      $mdDialog.hide(answer);
    };
  }
})
