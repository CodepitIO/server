angular.module('Util').factory('UtilFactory', [
	'$http',
	'$q',
	'$resource',
	'RequestAPI',
	function($http, $q, $resource, request) {
		var ProfilePicAPI = $resource('/api/v1/picture/:email/:size', {
			email: '@email',
			size: '@size'
		});
		return {
			getProfilePicByEmail: request.send('get', ProfilePicAPI)
		};
	}
]);
