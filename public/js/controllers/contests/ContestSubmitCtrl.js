angular.module('Contests')
  .controller('ContestSubmitController', [
    '$scope',
    'Languages',
    'TextEditorLanguageMode',
    'ContestAPI',
    function ($scope, Languages, CodemirrorMode, ContestAPI) {
      $scope.languages = Languages
      $scope.editorOptions = {
        theme: 'blackboard',
        lineWrapping: true,
        lineNumbers: true,
        mode: ''
      }

      $scope.updateTextMode = function () {
        $scope.editorOptions.mode = CodemirrorMode[$scope.submission.language || '']
      }

      $scope.loading = false
      $scope.submit = function () {
        $scope.loading = true
        ContestAPI.submit($scope.id, $scope.submission, function (err, submission) {
          $scope.loading = false
          if (submission) {
            $scope.submission.code = $scope.submission.language =
              $scope.submission.codefile = $scope.submission.problem = null
            $scope.updateTextMode()
            $scope.pushSubmission(submission)
          }
        })
      }
    }
  ])
