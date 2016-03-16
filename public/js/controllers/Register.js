var app = angular.module('Register');
app.controller('RegisterController', [
	'$scope',
	'$location',
	'$rootScope',
	'Notification',
	'AccountFactory',
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
			account.register($scope.account)
				.then(function(data) {
					if (data._id) {
						$rootScope.user = data;
						$location.path('/profile');
						Notification.success("Bem-vindo, " + data.local.name + ".");
					}
				}, function(error) {
					Notification.error(error);
				});
		};
	}
]);
