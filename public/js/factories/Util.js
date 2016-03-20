angular.module('Util').factory('UtilFactory', [
	'$http',
	'$q',
	'$resource',
	'RequestAPI',
	function($http, $q, $resource, global) {
		var ProfilePicAPI = $resource('/api/picture/:email/:size', {
			email: '@email',
			size: '@size'
		});
		return {
			getProfilePicByEmail: global.get.bind(null, ProfilePicAPI)
		};
	}
]);
