angular.module('Account')
	.factory('AccountAPI', [
		'$http',
		'$q',
		'$resource',
		'RequestAPI',
		function($http, $q, $resource, request) {
			var RegisterAPI = $resource('/api/v1/account/register', {
				name: '@name',
				surname: '@surname',
				email: '@email',
				password: '@password',
				confirmPassword: '@confirmPassword',
				username: '@username'
			});
			var EditAPI = $resource('/api/v1/account/edit', {
				name: '@name',
				surname: '@surname',
				email: '@email',
				password: '@password',
				newPassword: '@newPassword',
				confirmNewPassword: '@confirmNewPassword',
				username: '@username'
			});
			var LoginAPI = $resource('/api/v1/account/login', {
				email: '@email',
				password: '@password'
			});
			var LogoutAPI = $resource('/api/v1/account/logout', {});
			return {
				register: request.send('save', RegisterAPI),
				edit: request.send('save', EditAPI),
				login: request.send('save', LoginAPI),
				logout: request.send('get', LogoutAPI),
			};
		}
	])
	.factory('AccountFacade', [
		function()
	]);
