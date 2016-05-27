angular.module('User')
  .controller('LoginController', [
    '$scope',
    'UserFacade',
    'UserSharedState',
    function ($scope, user, userState) {
      $scope.user = {
        email: '',
        password: ''
      }
      $scope.userState = userState

      $scope.login = function () {
        user.login($scope.user, function () {
          userState.reset()
        })
      }

      $scope.logout = function () {
        user.logout(function () {
          userState.reset()
        })
      }
    }
  ])
