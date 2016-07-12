angular.module('User')
  .controller('ProfileValidateController', [
    '$scope',
    '$stateParams',
    'UserAPI',
    function ($scope, $stateParams, UserAPI) {
      $scope.validating = true
      UserAPI.validate($stateParams.hash)
    }
  ])
