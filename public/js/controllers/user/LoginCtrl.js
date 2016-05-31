angular.module('User')
  .controller('LoginController', [
    '$scope',
    'UserFacade',
    'UserSharedState',
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
