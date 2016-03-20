angular.module('Tag').factory('TagFactory', [
	'$resource',
	'RequestAPI',
	function($resource, global) {
		var GetTagsAPI = $resource('/api/tags');
		var CreateTagAPI = $resource('/api/tags/create/:name', {
			name: '@name'
		});
		return {
			getTags: global.get.bind(null, GetTagsAPI),
			create: global.get.bind(null, CreateTagAPI)
		};
	}
]);
