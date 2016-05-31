angular.module('User')
  .service('UserSharedState', [
    '$rootScope',
    function ($rootScope) {
      var $scope = this

      $scope.reset = function () {
        $scope.user = $rootScope.user || {}
      }

      $rootScope.$watch(function() {
        return $rootScope.user
      }, function() {
        $scope.reset()
      })
    }
  ])