angular.module('User')
  .controller('LoginController', [
    '$scope',
    'UserAPI',
    'UserState',
    function ($scope, UserAPI, UserState) {
      $scope.UserState = UserState
      $scope.data = {}

      $scope.login = function () {
        UserAPI.login($scope.data)
      }

      $scope.logout = function () {
        UserAPI.logout()
      }
    }
  ])
