angular.module('Contests')
  .controller('ContestSubmissionsController', function ($scope, Languages, Verdict) {
      $scope.languages = Languages;
      $scope.verdict = Verdict;
    });
