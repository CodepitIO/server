angular.module('User')
  .controller('ProfileController', [
    '$scope',
    '$state',
    '$stateParams',
    'UserState',
    'SocketState',
    function ($scope, $state, $stateParams, userState, socketState) {
      if (!$stateParams.id) {
        $state.go('.data', {
          id: userState.user._id
        }, {
          notify: false
        })
      } else if ($state.is('profile')) {
        $state.go('.data')
      }
      $scope.state = $state
    }
  ])
