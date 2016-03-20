angular.module('SingleContestService', []).factory('SingleContestFactory', [
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
		var GetParticipantsAPI = $resource('/api/contest/:id/participants', {});
		var GetParticipantSubmissionsAPI = $resource('/api/contest/:id/submissions/:pid', {});
		return {
			// REST
			remove: global.get.bind(null, RemoveContestAPI),
			getFullData: global.get.bind(null, GetFullDataByIDAPI),
			join: global.post.bind(null, JoinAPI),
			leave: global.post.bind(null, LeaveAPI),
			edit: global.post.bind(null, EditAPI),
			getScoreboard: global.get.bind(null, GetScoreboardAPI),
			getDynamicScoreboard: global.get.bind(null, GetDynamicScoreboardAPI),
			getParticipants: global.get.bind(null, GetParticipantsAPI),
			getParticipantSubmissions: global.get.bind(null, GetParticipantSubmissionsAPI),

			// Functions
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
			}
		};
	}
]);
