var app = angular.module('Submission')
app.controller('SubmissionController', [
  '$scope',
  '$stateParams',
  'Verdict',
  'Languages',
  'SubmissionAPI',
  function ($scope, $stateParams, Verdict, Languages, SubmissionAPI) {
    $scope.verdict = Verdict
    $scope.languages = Languages
    SubmissionAPI.get({
      id: $stateParams.id
    }).then(function (data) {
      $scope.submission = data.submission
    })
  }
])
