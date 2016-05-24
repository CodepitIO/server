angular.module('Tag').factory('TagFactory', [
	'$resource',
	'RequestAPI',
	function($resource, request) {
		var GetTagsAPI = $resource('/api/v1/tags');
		var CreateTagAPI = $resource('/api/v1/tags/create/:name', {
			name: '@name'
		});
		return {
			getTags: request.send('get', GetTagsAPI),
			create: request.send('get', CreateTagAPI)
		};
	}
]);
