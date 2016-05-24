var app = angular.module('Login');
app.controller('LoginController', [
	'$scope',
	'$cookies',
	'$rootScope',
	'$state',
	'Notification',
	'UtilFactory',
	'AccountFactory',
	function($scope, $cookies, $rootScope, $state, Notification, util, account) {
		$scope.account = {
			email: '',
			password: ''
		};

		$scope.loadedPictureUrl = false;
		$scope.pictureUrl = '';

		function getProfilePic() {
			util.getProfilePicByEmail({
					email: $rootScope.user.local.email,
					size: 50
				})
				.then(function(data) {
					$scope.pictureUrl = data.url;
					$scope.loadedPictureUrl = true;
					console.log($scope.pictureUrl);
				});
		}

		$scope.login = function() {
			$rootScope.user = null;
			$cookies.remove('user');
			account.login($scope.account)
				.then(function(data) {
					if (data._id) {
						$rootScope.user = data;
						$cookies.put('user', JSON.stringify(data), {
							expires: new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
						});
						$state.go('profile');
					}
				});
		};

		$scope.logout = function() {
			$cookies.remove('user');
			$rootScope.user = null;
			$scope.loadedPictureUrl = false;
			$state.go('home');
			account.logout().then(function() {});
		};

		$scope.$watch(function() {
			return $rootScope.user;
		}, function() {
			if ($rootScope.user && $rootScope.user.local) {
				getProfilePic();
			}
		});

	}
]);
