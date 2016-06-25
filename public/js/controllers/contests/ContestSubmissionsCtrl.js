angular.module('Contests')
  .controller('ContestSubmissionsController', [
    '$scope',
    'Languages',
    'Verdict',
    function ($scope, Languages, Verdict) {
      $scope.languages = Languages
      $scope.verdict = Verdict
    }
  ])
