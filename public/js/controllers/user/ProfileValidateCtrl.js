angular.module('User')
  .controller('ProfileValidateController',
    function ($scope, $stateParams, UserAPI) {
      $scope.validating = true;
      UserAPI.validate($stateParams.hash);
    }
  );
