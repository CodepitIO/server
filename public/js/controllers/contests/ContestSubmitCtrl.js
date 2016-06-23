angular.module('Contests')
  .controller('ContestSubmitController', [
    '$scope',
    'Notification',
    'Languages',
    'TextEditorLanguageMode',
    'ContestAPI',
    'ContestState',
    function ($scope, Notification, Languages, CodemirrorMode, ContestAPI, ContestState) {
      $scope.editorOptions = {
        theme: 'blackboard',
        lineWrapping: true,
        lineNumbers: true,
        mode: ''
      }
      $scope.languages = Languages
      $scope.ContestState = ContestState

      $scope.updateTextMode = function () {
        $scope.editorOptions.mode = CodemirrorMode[$scope.ContestState.submission.language || '']
      }

      $scope.loading = false
      $scope.submit = function () {
        $scope.loading = true
        ContestAPI.submit(ContestState.id, ContestState.submission, function (err, submission) {
          $scope.loading = false
          if (submission) {
            ContestState.submission.code =
              ContestState.submission.language =
              ContestState.submission.codefile =
              ContestState.submission.problem = null
            $scope.updateTextMode()
            ContestState.pushSubmission(submission)
          }
        })
      }
    }
  ])
