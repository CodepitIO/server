angular.module('SubmissionService', []).factory('SubmissionFactory', [
	'$http',
	'$q',
	'$resource',
	'GlobalFactory',
	function($http, $q, $resource, global) {
		var SendAPI = $resource('/api/submission/send', {
			contestId: '@contestId',
			code: '@code',
			problem: '@problem',
			language: '@language'
		});
		var GetAPI = $resource('/api/submission/get/:id', {});
		return {
			send: global.post.bind(null, SendAPI),
			get: global.get.bind(null, GetAPI)
		};
	}
]);
