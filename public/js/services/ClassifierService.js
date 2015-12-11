angular.module('ClassifierService', []).factory('ClassifierFactory', [
	'$resource',
	'GlobalFactory',
	function($resource, global) {
		var GetAPI = $resource('/api/classifier/:handle', {});
		return {
			get: global.get.bind(null, GetAPI)
		};
	}
]);
