angular
  .module("User")
  .controller(
    "LoginController",
    function ($scope, $mdDialog, $mdMedia, UserAPI, UserState) {
      $scope.loading = false;
      $scope.UserState = UserState;
      $scope.data = {};

      $scope.login = function () {
        $scope.loading = true;
        UserAPI.login($scope.data, function () {
          $scope.loading = false;
        });
      };

      $scope.logout = function () {
        UserAPI.logout();
      };

      $scope.openForgotPasswordDialog = function (ev) {
        var confirm = $mdDialog
          .prompt()
          .title("Forgot password?")
          .textContent("We will send instructions to your e-mail.")
          .clickOutsideToClose(true)
          .placeholder("E-mail or username")
          .targetEvent(ev)
          .ok("Send")
          .cancel("Cancel");
        $mdDialog.show(confirm).then(function (email) {
          UserAPI.sendPasswordRecoveryEmail(email);
        });
      };
    }
  );
