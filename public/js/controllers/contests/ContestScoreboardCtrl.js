angular.module('Contests').controller('ContestScoreboardController', [
  '$scope',
  'ContestState',
  function ($scope, contestState) {
    $scope.contestState = contestState
  }
])
