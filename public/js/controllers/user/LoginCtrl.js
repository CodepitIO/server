angular.module('User')
  .controller('LoginController', [
    '$scope',
    'UserAPI',
    'UserState',
    function ($scope, UserAPI, userState) {
      $scope.userState = userState
      $scope.data = {}

      $scope.login = function () {
        UserAPI.login($scope.data)
      }

      $scope.logout = function () {
        UserAPI.logout()
      }
    }
  ])
