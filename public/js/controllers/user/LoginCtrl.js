angular.module('User')
  .controller('LoginController', [
    '$scope',
    'UserFacade',
    'UserState',
    function ($scope, user, userState) {
      $scope.userState = userState
      $scope.data = {}

      $scope.login = function () {
        user.login($scope.data)
      }

      $scope.logout = function () {
        user.logout()
      }
    }
  ])
