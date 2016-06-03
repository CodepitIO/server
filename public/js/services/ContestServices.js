angular.module('Contests')
  .service('ContestState', [
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
  .service('SettingsState', [
    function () {
      var $scope = this
      $scope.contest = {
        options: {
          hasFrozen: false,
          hasBlind: false,
          isPrivate: false,
          watchPrivate: false,
          penalty: 20,
        }
      }
      $scope.tab = 0
      $scope.nextTab = function() {
        $scope.tab = $scope.tab+1
      }
    }
  ])
