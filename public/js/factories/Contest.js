angular.module('Contests')
	.factory('ContestAPI', [
		'$http',
		'$q',
		'$resource',
		'RequestAPI',
		function($http, $q, $resource, request) {
			var RemoveContestAPI = $resource('/api/v1/contest/:id/remove', {});
			var GetFullDataByIDAPI = $resource('/api/v1/contest/:id/get/full', {});
			var JoinAPI = $resource('/api/v1/contest/:id/join', {
				id: '@id',
				password: '@password',
				team: '@team'
			});
			var LeaveAPI = $resource('/api/v1/contest/:id/leave', {
				id: '@id'
			});
			var EditAPI = $resource('/api/v1/contest/:id/edit', {
				id: '@id',
				name: '@name',
				descr: '@descr',
				startDateTime: '@startDateTime',
				endDateTime: '@endDateTime',
				frozenDateTime: '@frozenDateTime',
				blindDateTime: '@blindDateTime',
				contestantType: '@contestantType',
				password: '@password',
				confirmPassword: '@confirmPassword',
				problems: '@problems'
			});
			var GetScoreboardAPI = $resource('/api/v1/contest/:id/scoreboard', {});
			var GetDynamicScoreboardAPI = $resource('/api/v1/contest/:id/scoreboard/dynamic', {});
			return {
				remove: request.send('get', RemoveContestAPI),
				getFullData: request.send('get', GetFullDataByIDAPI),
				join: request.send('save', JoinAPI),
				leave: request.send('save', LeaveAPI),
				edit: request.send('save', EditAPI),
				getScoreboard: request.send('get', GetScoreboardAPI),
				getDynamicScoreboard: request.send('get', GetDynamicScoreboardAPI),
			};
		}
	])
	.factory('ContestFacade', [
		'Notification',
		'ContestAPI',
		function(Notification, contestAPI) {
			return {
				// Leave a contest
				leave: function(id, callback) {
					contestAPI.leave({
						id: id,
					}).then(function(data) {
						Notification('Você saiu da competição.');
						callback(null, true);
					}, function(err) {
						Notification.error(err);
						callback(err);
					});
				},

				// Join a contest
				join: function(contest, data, callback) {
					if (contest.isPrivate && data.password.length === 0) {
						return Notification.error('Você deve inserir uma senha.');
					}
					if (data.role === '') {
						return Notification.error('Você deve informar se deseja participar em time ou individualmente.');
					}
					if (data.role === 'team' && typeof(data.team) !== 'string') {
						return Notification.error('Você deve informar um time.');
					}
					if (data.role !== 'team' || typeof(data.team) !== 'string') {
						data.team = '0';
					}
					contestAPI.join({
						id: contest._id,
						password: data.password,
						team: data.team,
					}).then(function(data) {
						Notification.success('Inscrito com sucesso nessa competição!');
						callback(null, true);
					}, function(err) {
						Notification.error(err);
						callback(err);
					});
				},

				// Remove a contest
				remove: function(id, callback) {
					contestAPI.remove({
							id: id
						})
						.then(function(data) {
							Notification('Competição removida.');
							callback(null, true);
						}, function(err) {
							callback(err);
						});
				},
			};
		}
	])
	.service('ContestSharedState', [
		'Notification',
		'ContestAPI',
		'TimeFactory',
		function(Notification, ContestAPI, Time) {
			var $scope = this;

			$scope.submission = {};
			$scope.reset = function() {
				$scope.submission = {
					language: null,
					code: '',
					codefile: null
				};
				$scope.data = {};
			}

			$scope.getScoreboard = function(id, callback) {
				ContestAPI.getScoreboard({
						id: id
					})
					.then(function(data) {
						$scope.data = data;
						$scope.data.id = id;
						$scope.data.start = new Date($scope.data.start);
						$scope.data.end = new Date($scope.data.end);
						$scope.data.frozen = new Date($scope.data.frozen);
						$scope.data.blind = new Date($scope.data.blind);
						callback(null, true);
					}, function(err) {
						Notification.error('Você precisa estar registrado nessa competição para visualizá-la');
						callback(err);
					});
			}
		}
	]);
