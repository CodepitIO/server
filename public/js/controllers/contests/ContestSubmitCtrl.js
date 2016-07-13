angular.module('Contests')
  .controller('ContestSubmitController', function ($scope, Languages, CodemirrorMode, ContestAPI, ContestState) {
      $scope.languages = Languages
      $scope.editorOptions = {
        theme: 'blackboard',
        lineWrapping: true,
        lineNumbers: true,
      }

      $scope.updateTextMode = function () {
        $scope.editorOptions.mode = CodemirrorMode[ContestState.submit.language || '']
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
