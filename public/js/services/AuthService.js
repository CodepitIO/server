angular.module('AuthService', []).factory('AuthFactory', [
	'$http',
	'$q',
	'$resource',
	'GlobalFactory',
	function($http, $q, $resource, global) {
		var LoginAPI = $resource('/api/login', {
			email: '@email',
			password: '@password'
		});
		var LogoutAPI = $resource('/api/logout', {});
		return {
			login: global.post.bind(null, LoginAPI),
			logout: global.get.bind(null, LogoutAPI)
		};
	}
]);
