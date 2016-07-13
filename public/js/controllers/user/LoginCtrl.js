angular.module('User')
  .controller('LoginController', function ($scope, $mdDialog, $mdMedia, UserAPI, UserState) {
      $scope.loading = false
      $scope.UserState = UserState
      $scope.data = {}

      $scope.login = function () {
        $scope.loading = true
        UserAPI.login($scope.data, function() {
          $scope.loading = false
        })
      }

      $scope.logout = function () {
        UserAPI.logout()
      }

      $scope.openForgotPasswordDialog = function(ev) {
        var confirm = $mdDialog.prompt()
          .title('Esqueceu a senha?')
          .textContent('Enviaremos instruções para seu e-mail.')
          .clickOutsideToClose(true)
          .placeholder('E-mail ou username')
          .targetEvent(ev)
          .ok('Enviar')
          .cancel('Cancelar')
        $mdDialog.show(confirm).then(function(email) {
          UserAPI.sendPasswordRecoveryEmail(email)
        })
      }
    })
