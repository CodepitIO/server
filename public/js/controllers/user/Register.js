angular.module('User')
  .controller('RegisterController', [
    '$scope',
    '$location',
    '$rootScope',
    'Notification',
    'UserFacade',
    function ($scope, $location, $rootScope, Notification, user) {
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
        user.register($scope.user, function() {
          $scope.loading = false
        })
      }
    }
  ])
