angular.module('User')
  .controller('RegisterController',
    function ($scope, $location, $rootScope, Countries, Notification, UserAPI) {
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
  )
