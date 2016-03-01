var app = angular.module('TeamCtrl', []);
app.controller('TeamController', [
	'$rootScope',
	'$scope',
	'$stateParams',
	'$location',
	'$timeout',
	'Notification',
	'TeamFactory',
	'UtilFactory',
	'GlobalFactory',
	function($rootScope, $scope, $stateParams, $location, $timeout, Notification, team, util, global) {
		var id = $stateParams.id;
		$scope.team = {};
		$scope.newInvite = '';
		$scope.tabSelected = 'invites';
		$scope.config = {
			id: null,
			name: '',
			descr: ''
		};

		var getTeamData = function() {
			team.get({
					id: id
				})
				.then(function(data) {
					$scope.team = data;
					$scope.config.id = id;
					$scope.config.name = data.name;
					$scope.config.descr = data.description;
				}, function(error) {
					$location.path('/');
					Notification.error(error);
				});
		};
		getTeamData();

		var removeUserFilter = function(id, elem) {
			return elem.id.toString() != id.toString();
		};

		$scope.changeTab = function(newTab) {
			$scope.tabSelected = newTab;
		};

		$scope.invite = function() {
			team.invite({
					id: id,
					invitee: $scope.newInvite
				})
				.then(function(data) {
					Notification.success(data.name + " convidado com sucesso!");
					$scope.team.invites.push(data);
				}, function(err) {
					Notification.error(err);
				});
		};

		$scope.removeFromTeam = function(removee) {
			team.remove({
					id: id,
					removee: removee
				})
				.then(function(data) {
					$scope.team.members = $scope.team.members.filter(removeUserFilter.bind(null, removee));
					$scope.team.invites = $scope.team.invites.filter(removeUserFilter.bind(null, removee));
				}, function(err) {
					Notification.error(err);
				});
		};

		var lastTime = 0;
		$scope.edit = function() {
			var now = Date.now();
			lastTime = now;
			$timeout(function() {
				if (lastTime == now) {
					team.edit($scope.config);
				}
			}, 400);
		};
	}
]);
