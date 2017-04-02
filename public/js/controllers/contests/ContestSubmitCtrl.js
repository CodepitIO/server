angular.module('Contests')
  .controller('ContestSubmitController',
    function ($scope, Languages, TextEditorLanguageMode, ContestAPI, ContestState) {
      $scope.languagesDict = Languages
      $scope.editorOptions = {
        theme: 'blackboard',
        lineWrapping: true,
        lineNumbers: true,
      }

      $scope.updateTextMode = function () {
        $scope.editorOptions.mode = TextEditorLanguageMode[ContestState.submit.language || '']
      }
      setTimeout(function() {
        $scope.updateTextMode()
      }, 0)

      $scope.loading = false
      $scope.submit = function () {
        $scope.loading = true
        ContestAPI.submit(ContestState.id, ContestState.submit, function (err, submission) {
          $scope.loading = false
          if (submission) {
            ContestState.submit = {}
            ContestState.tryPushSubmission(submission)
            $scope.updateTextMode()
          }
        })
      }
    })
