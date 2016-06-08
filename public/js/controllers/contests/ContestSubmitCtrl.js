angular.module('Contests')
  .controller('ContestSubmitController', [
    '$scope',
    'Notification',
    'Languages',
    'TextEditorLanguageMode',
    'ContestFacade',
    'ContestState',
    function ($scope, Notification, Languages, CodemirrorMode, contest, contestState) {
      $scope.editorOptions = {
        theme: 'blackboard',
        lineWrapping: true,
        lineNumbers: true,
        mode: ''
      }
      $scope.languages = Languages
      $scope.contestState = contestState

      $scope.updateTextMode = function () {
        $scope.editorOptions.mode = CodemirrorMode[$scope.contestState.submission.language || '']
      }

      $scope.loading = false
      $scope.submit = function () {
        $scope.loading = true
        contest.submit(contestState.id, contestState.submission, function (err, submission) {
          $scope.loading = false
          if (submission) {
            contestState.submission.code =
            contestState.submission.language =
            contestState.submission.codefile =
            contestState.submission.problem = null
            $scope.updateTextMode()
            contestState.pushSubmission(submission)
          }
        })
      }
    }
  ])
