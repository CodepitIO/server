angular.module('Contests')
.factory('ContestInstanceAPI', [
	'$http',
	'$q',
	'$resource',
	'GlobalFactory',
	function($http, $q, $resource, global) {
		var RemoveContestAPI = $resource('/api/contest/:id/remove', {});
		var GetFullDataByIDAPI = $resource('/api/contest/:id/get/full', {});
		var JoinAPI = $resource('/api/contest/:id/join', {
			id: '@id',
			password: '@password',
			team: '@team'
		});
		var LeaveAPI = $resource('/api/contest/:id/leave', {
			id: '@id'
		});
		var EditAPI = $resource('/api/contest/:id/edit', {
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
		var GetScoreboardAPI = $resource('/api/contest/:id/scoreboard', {});
		var GetDynamicScoreboardAPI = $resource('/api/contest/:id/scoreboard/dynamic', {});
		return {
			remove: global.get.bind(null, RemoveContestAPI),
			getFullData: global.get.bind(null, GetFullDataByIDAPI),
			join: global.post.bind(null, JoinAPI),
			leave: global.post.bind(null, LeaveAPI),
			edit: global.post.bind(null, EditAPI),
			getScoreboard: global.get.bind(null, GetScoreboardAPI),
			getDynamicScoreboard: global.get.bind(null, GetDynamicScoreboardAPI),
		};
	}
])
.factory('ContestInstanceFunctions', [
	'Notification',
	'ContestInstanceAPI',
	function(Notification, contestAPI) {
		return {
			getScoreMap: function(submissions, moment) {
				var scores = {};
				for (var i = 0; i < submissions.length; i++) {
					var sub = submissions[i];
					if (sub.time > moment) {
						break;
					}

					var contestant = sub.contestant;
					var problem = sub.problem;
					if (!scores[contestant]) {
						scores[contestant] = {};
						scores[contestant][problem] = {
							status: sub.verdict,
							errorCount: (sub.verdict == 2 ? 1 : 0),
							time: ((sub.verdict == 1) ? sub.time : null)
						};
					} else {
						scores[contestant][problem] = scores[contestant][problem] || {
							errorCount: 0
						};
						var r = scores[contestant][problem];
						if (r.status == 1) continue;
						r.status = sub.verdict;
						if (r.status == 2) r.errorCount++;
						else if (r.status == 1) r.time = sub.time;
					}
				}
				return scores;
			},

			getLeadershipOrder: function(contestants, problems, scores) {
				var ord = [];
				for (var A in contestants) {
					var time = 0,
						win = 0;
					for (var B in problems) {
						if (scores[A] && scores[A][B] && scores[A][B].status == 1) {
							time = time + 20 * scores[A][B].errorCount + scores[A][B].time;
							win++;
						}
					}
					ord.push([win, time, A]);
				}
				ord.sort(function(a, b) {
					if (a[0] != b[0]) return b[0] - a[0];
					else if (a[1] != b[1]) return a[1] - b[1];
					return a[2] < b[2];
				});
				return ord;
			},

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
				contestAPI.remove({id: id})
				.then(function(data) {
					Notification('Competição removida.');
					callback(null, true);
				}, function(err) {
					callback(err);
				});
			},
		};
	}
]);
