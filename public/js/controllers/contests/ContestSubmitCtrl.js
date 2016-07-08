angular.module('Contests')
  .controller('ContestSubmitController', [
    '$scope',
    'Languages',
    'TextEditorLanguageMode',
    'ContestAPI',
    'ContestState',
    function ($scope, Languages, CodemirrorMode, ContestAPI, ContestState) {
      $scope.languages = Languages
      $scope.editorOptions = {
        theme: 'blackboard',
        lineWrapping: true,
        lineNumbers: true,
        mode: ''
      }

      $scope.updateTextMode = function () {
        $scope.editorOptions.mode = CodemirrorMode[ContestState.submit.language || '']
      }

      $scope.loading = false
      $scope.submit = function () {
        $scope.loading = true
        ContestAPI.submit($scope.id, ContestState.submit, function (err, submission) {
          $scope.loading = false
          if (submission) {
            ContestState.submit = {}
            ContestState.tryPushSubmission(submission)
            $scope.updateTextMode()
          }
        })
      }
    }
  ])
