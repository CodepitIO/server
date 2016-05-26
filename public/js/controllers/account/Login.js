angular.module('Account')
	.controller('LoginController', [
		'$scope',
		'AccountFacade',
		'AccountSharedState',
		function($scope, account, accountState) {
			$scope.account = {
				email: '',
				password: ''
			};
			$scope.accountState = accountState;

			$scope.login = function() {
				account.login($scope.account, function() {
					accountState.reset();
				});
			};

			$scope.logout = function() {
				account.logout(function() {
					accountState.reset();
				});
			};
		}
	]);
