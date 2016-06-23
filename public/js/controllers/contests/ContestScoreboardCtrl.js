angular.module('Contests').controller('ContestScoreboardController', [
  '$scope',
  'ContestState',
  function ($scope, ContestState) {
    $scope.ContestState = ContestState;
  }
])
