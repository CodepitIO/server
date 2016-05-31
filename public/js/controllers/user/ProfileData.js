angular.module('User')
  .controller('ProfileDataController', [
    '$scope',
    'UserSharedState',
    function ($scope, userState) {
      $scope.userState = userState
    }
  ])
