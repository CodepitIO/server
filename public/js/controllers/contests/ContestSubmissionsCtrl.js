angular.module('Contests')
  .controller('ContestSubmissionsController', [
    '$scope',
    'Languages',
    'Verdict',
    'ContestState',
    function ($scope, Languages, Verdict, ContestState) {
      $scope.ContestState = ContestState
      $scope.languages = Languages
      $scope.verdict = Verdict
    }
  ])
