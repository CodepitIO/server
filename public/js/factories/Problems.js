angular.module('Problems')
	.factory('ProblemsAPI', [
		'$http',
		'$resource',
		'$q',
		'RequestAPI',
		function($http, $resource, $q, request) {
			var FetchProblemsAPI = $resource('/api/v1/problems/fetch', {
				regex: '@regex',
				problems: '@problems'
			});
			var GetProblemAPI = $resource('/api/v1/problems/:id', {});
			return {
				fetch: request.send('save', FetchProblemsAPI),
				get: request.send('get', GetProblemAPI),
			};
		}
	])
	.factory('Problems', [
		'ProblemsAPI',
		function(ProblemsAPI) {
			return {
				get: function(id, callback) {
					ProblemsAPI.get({
						id: id,
					}).then(function(data) {
						return callback(null, data);
					}, callback);
				}
			};
		}
	]);
