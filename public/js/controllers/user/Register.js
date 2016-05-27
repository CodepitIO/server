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
        username: ''
      }

      $scope.register = function () {
        user.register($scope.user)
      }
    }
  ])
