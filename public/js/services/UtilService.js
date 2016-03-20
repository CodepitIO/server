angular.module('UtilService', []).factory('UtilFactory', [
	'$http',
	'$q',
	'$resource',
	'GlobalFactory',
	function($http, $q, $resource, global) {
		var ProfilePicAPI = $resource('/api/picture/:email/:size', {
			email: '@email',
			size: '@size'
		});
		var ServerTimeAPI = $resource('/api/server/time', {});
		return {
			getProfilePicByEmail: global.get.bind(null, ProfilePicAPI),
			getServerTime: global.get.bind(null, ServerTimeAPI)
		};
	}
]);
