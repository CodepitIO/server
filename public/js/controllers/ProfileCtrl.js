var app = angular.module('ProfileCtrl', []);
app.controller('ProfileController', [
	'$scope',
	'$rootScope',
	'Notification',
	'UtilFactory',
	'AccountFactory',
	'TeamFactory',
	function($scope, $rootScope, Notification, util, account, team) {
		$scope.tabSelected = 'teams';

		$scope.account = {
			name: '',
			surname: '',
			email: '',
			password: '',
			newPassword: '',
			confirmNewPassword: '',
			username: ''
		};
		$scope.pictureUrl = '';

		$scope.loadedPictureUrl = false;
		$scope.loadedEditingProfile = true;

		$scope.newTeamName = '';
		$scope.teams = [];
		$scope.invited = [];

		var getTeams = function() {
			team.getFromUser({
					id: $rootScope.user._id
				})
				.then(function(data) {
					$scope.teams = data.teams;
					$scope.invited = data.invited;
				});
		};

		var removeTeamInvitationFilter = function(id, elem) {
			return elem._id.toString() != id.toString();
		};

		$scope.changeTab = function(newTab) {
			$scope.tabSelected = newTab;
		};

		$scope.createTeam = function() {
			team.create({
					name: $scope.newTeamName
				})
				.then(function(data) {
					$scope.teams.push(data);
					Notification.info("Time criado com sucesso!");
				}, function(error) {
					Notification.error(error);
				});
		};

		$scope.leaveTeam = function(id) {
			team.leave({
					id: id
				})
				.then(function(data) {
					$scope.teams = $scope.teams.filter(function(elem) {
						return elem._id.toString() != id.toString();
					});
				});
		};

		function getProfilePic() {
			util.getProfilePicByEmail({
					email: $rootScope.user.local.email,
					size: 170
				})
				.then(function(data) {
					$scope.pictureUrl = data.url;
					$scope.loadedPictureUrl = true;
				});
		}

		getProfilePic();

		$scope.edit = function() {
			$scope.loadedEditingProfile = false;
			account.edit($scope.account)
				.then(function(data) {
					//TODO se passar null, dá pau no servidor
					$scope.loadedEditingProfile = true;
					Notification.info("Dados atualizados!");
					$scope.account.password = '';
				}, function(error) {
					$scope.loadedEditingProfile = true;
					Notification.error(error);
					$scope.account.password = '';
				});
		};

		$scope.acceptTeamInvitation = function(id) {
			team.accept({
					id: id
				})
				.then(function(data) {
					$scope.invited = $scope.invited.filter(removeTeamInvitationFilter.bind(null, id));
					$scope.teams.push(data);
				});
		};

		$scope.declineTeamInvitation = function(id) {
			team.decline({
					id: id
				})
				.then(function(data) {
					$scope.invited = $scope.invited.filter(removeTeamInvitationFilter.bind(null, id));
				});
		};

		$scope.$watch(function() {
			return $rootScope.user;
		}, function() {
			$scope.account = $rootScope.user.local;
			$scope.account.password = $scope.account.newPassword = $scope.account.confirmNewPassword = '';
			getTeams();
		});
	}
]);
