angular.module('User')
  .controller('ProfileRecoverController', function ($scope, $stateParams, UserAPI) {
      $scope.user = {
        hash: $stateParams.hash,
        password: '',
        confirmPassword: ''
      }
      $scope.recover = function() {
        UserAPI.recover($scope.user)
      }
    })
