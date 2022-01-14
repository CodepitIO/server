angular
  .module("User")
  .controller(
    "ProfileTeamsController",
    function ($scope, $mdDialog, TeamAPI, UserAPI) {
      $scope.member = [];
      $scope.invited = [];
      $scope.loading = true;
      UserAPI.teams(function (err, teams) {
        $scope.member = teams.member;
        $scope.invited = teams.invited;
        $scope.loading = false;
      });

      $scope.newTeam = function (ev) {
        var confirm = $mdDialog
          .prompt()
          .title("Create Team")
          .clickOutsideToClose(true)
          .placeholder("Team name")
          .targetEvent(ev)
          .ok("Create")
          .cancel("Cancel");
        $mdDialog.show(confirm).then(function (name) {
          TeamAPI.create(name);
        });
      };
    }
  );
