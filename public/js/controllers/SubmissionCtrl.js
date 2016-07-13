var app = angular.module('Submission')
app.controller('SubmissionController',
  function ($scope, $stateParams, Verdict, Languages, TextEditorLanguageMode, SubmissionAPI) {
    $scope.verdict = Verdict
    $scope.languages = Languages

    var cm = null
    $scope.editorOptions = {
      theme: 'blackboard',
      lineWrapping: true,
      lineNumbers: true,
      readOnly: true,
      viewportMargin: Infinity,
      onLoad : function(_cm){
        cm = _cm
      }
    }

    SubmissionAPI.get({
      id: $stateParams.id
    }).then(function (data) {
      $scope.submission = data.submission
      $scope.editorOptions.mode = TextEditorLanguageMode[$scope.submission.language || '']
    })

    $scope.selectAll = function() {
      cm.execCommand('selectAll')
    }
  })
