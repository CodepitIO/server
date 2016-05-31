angular.module('User')
  .controller('ProfileDataController', [
    '$scope',
    'UserState',
    function ($scope, userState) {
      $scope.userState = userState
    }
  ])
