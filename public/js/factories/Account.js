angular.module('Account').factory('AccountFactory', [
	'$http',
	'$q',
	'$resource',
	'RequestAPI',
	function($http, $q, $resource, global) {
		var RegisterAPI = $resource('/api/account/register', {
			name: '@name',
			surname: '@surname',
			email: '@email',
			password: '@password',
			confirmPassword: '@confirmPassword',
			username: '@username'
		});
		var EditAPI = $resource('/api/account/edit', {
			name: '@name',
			surname: '@surname',
			email: '@email',
			password: '@password',
			newPassword: '@newPassword',
			confirmNewPassword: '@confirmNewPassword',
			username: '@username'
		});
		return {
			register: global.post.bind(null, RegisterAPI),
			edit: global.post.bind(null, EditAPI),
		};
	}
]);
