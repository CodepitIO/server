angular.module('User')
  .controller('RegisterController', [
    '$scope',
    '$location',
    '$rootScope',
    'Notification',
    'UserAPI',
    function ($scope, $location, $rootScope, Notification, UserAPI) {
      $scope.user = {
        name: '',
        surname: '',
        email: '',
        password: '',
        confirmPassword: '',
        username: '',
        recaptcha: null
      }

      $scope.loading = false
      $scope.register = function () {
        $scope.loading = true
        UserAPI.register($scope.user, function() {
          $scope.loading = false
        })
      }
    }
  ])
