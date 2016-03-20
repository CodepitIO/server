angular.module('Contests')
	.controller('ContestInstanceController', [
		'$scope',
		'$state',
		'$stateParams',
		'ContestInstanceService',
		function($scope, $state, $stateParams, Contest) {
			// Redirect to scoreboard when in path /contest
			if ($state.is('contest')) {
				$state.go('.scoreboard');
			}
			$scope.state = $state;

			Contest.clear();

			// Fetch contest data to contestService
			var contestId = $stateParams.id;
			Contest.getScoreboard(contestId, function(err, ok) {
				if (!ok) $state.go('contests.open');
				else {
					$scope.contest = Contest.data;
				}
			});
		}
	])
	.service('ContestInstanceService', [
		'Notification',
		'ContestInstanceAPI',
		'TimeFactory',
		function(Notification, ContestAPI, Time) {
			var scope = this;

			scope.submission = {};
			scope.clear = function() {
				scope.submission = {
					language: null,
					code: '',
					codefile: null
				};
				scope.data = {};
			}

			scope.getScoreboard = function(id, callback) {
				ContestAPI.getScoreboard({
						id: id
					})
					.then(function(data) {
						scope.data = data;
						scope.data.id = id;
						scope.data.start = new Date(scope.data.start);
						scope.data.end = new Date(scope.data.end);
						scope.data.frozen = new Date(scope.data.frozen);
						scope.data.blind = new Date(scope.data.blind);
						callback(null, true);
					}, function(err) {
						Notification.error('Você precisa estar registrado nessa competição para visualizá-la');
						callback(err);
					});
			}

		}
	]);
