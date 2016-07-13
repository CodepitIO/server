angular.module('User')
  .controller('ProfileController', function ($scope, $state, $stateParams, UserState, UserAPI) {
      $scope.state = $state
      $scope.UserState = UserState
      $scope.id = $stateParams.id
      if ($scope.id !== UserState.getId()) {
        UserAPI.get($scope.id, function(user) {
          $scope.user = user
          $scope.usernameTitle = user.username
        })
      } else {
        $scope.usernameTitle = 'Seu perfil'
      }
      $scope.sendValidationEmail = function() {
        UserAPI.sendValidationEmail()
      }
    })
