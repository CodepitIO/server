angular.module('User')
  .controller('ProfileController', [
    '$scope',
    '$state',
    '$stateParams',
    'UserSharedState',
    function ($scope, $state, $stateParams, userState) {
      if (!$stateParams.id) {
        $state.go('.data', {
          id: userState.id
        }, {
          notify: false
        })
      } else if ($state.is('profile')) {
        $state.go('.data')
      }
      $scope.state = $state

    /*
    $scope.tabSelected = 'teams'

    $scope.newTeamName = ''
    $scope.teams = []
    $scope.invited = []

    $scope.createTeam = function() {
    	team.create({
    			name: $scope.newTeamName
    		})
    		.then(function(data) {
    			$scope.teams.push(data)
    			Notification.info("Time criado com sucesso!")
    		}, function(error) {
    			Notification.error(error)
    		})
    }

    var getTeams = function() {
    	team.getFromUser({
    			id: $rootScope.user._id
    		})
    		.then(function(data) {
    			$scope.teams = data.teams
    			$scope.invited = data.invited
    		})
    }
    getTeams()

    var removeTeamInvitationFilter = function(id, elem) {
    	return elem._id.toString() != id.toString()
    }

    $scope.leaveTeam = function(id) {
    	team.leave(function() {
    		$scope.teams = $scope.teams.filter(function(elem) {
    			return elem._id.toString() !== id.toString()
    		})
    	})
    }

    $scope.acceptTeamInvitation = function(id) {
    	team.accept({
    			id: id
    		})
    		.then(function(data) {
    			$scope.invited = $scope.invited.filter(removeTeamInvitationFilter.bind(null, id))
    			$scope.teams.push(data)
    		})
    }

    $scope.declineTeamInvitation = function(id) {
    	team.decline({
    			id: id
    		})
    		.then(function(data) {
    			$scope.invited = $scope.invited.filter(removeTeamInvitationFilter.bind(null, id))
    		})
    };*/
    }
  ])
