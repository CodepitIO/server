angular.module('Contests')
  .service('ContestSharedState', [
    function () {
      var $scope = this
      $scope.submission = {}
      $scope.reset = function () {
        $scope.submission = {
          language: null,
          code: '',
          codefile: null
        }
        $scope.data = {}
      }
    }
  ])
