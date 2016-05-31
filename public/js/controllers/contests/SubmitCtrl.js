angular.module('Contests')
  .controller('SubmitController', [
    '$scope',
    'Notification',
    'SubmissionFunctions',
    'ContestInstanceService',
    'Languages',
    'TextEditorLanguageMode',
    function ($scope, Notification, Submission, Contest, Languages, CodemirrorMode) {
      $scope.editorOptions = {
        theme: 'blackboard',
        lineWrapping: true,
        lineNumbers: true,
        mode: ''
      }

      $scope.submission = Contest.submission

      $scope.updateTextMode = function () {
        $scope.editorOptions.mode = CodemirrorMode[$scope.submission.language || '']
      }

      $scope.contest = Contest
      $scope.languages = Languages

      $scope.submitting = false
      $scope.submit = function () {
        $scope.submitting = true
        Submission.send($scope.submission, Contest.data.id, function (err, data) {
          $scope.submitting = false
          if (data) {
            $scope.submission = Contest.submission = {
              language: null,
              code: '',
              codefile: null
            }
          }
        })
      }
    }
  ])
