angular.module('Account')
	.controller('RegisterController', [
		'$scope',
		'$location',
		'$rootScope',
		'Notification',
		'AccountFacade',
		function($scope, $location, $rootScope, Notification, account) {
			$scope.account = {
				name: '',
				surname: '',
				email: '',
				password: '',
				confirmPassword: '',
				username: ''
			};

			$scope.register = function() {
				account.register($scope.account);
			};
		}
	]);
