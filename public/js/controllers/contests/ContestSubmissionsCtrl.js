angular.module('Contests')
  .controller('ContestSubmissionsController', [
    '$scope',
    'Languages',
    'Verdict',
    'ContestState',
    function ($scope, Languages, Verdict, contestState) {
      $scope.contestState = contestState
      $scope.languages = Languages
      $scope.verdict = Verdict
    }
  ])
