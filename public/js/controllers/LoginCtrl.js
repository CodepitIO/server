var app = angular.module('LoginCtrl', []);
app.controller('LoginController', [
	'$scope',
	'$cookies',
	'$rootScope',
	'$state',
	'Notification',
	'UtilFactory',
	'AuthFactory',
	'AccountFactory',
	function($scope, $cookies, $rootScope, $state, Notification, util, auth, account) {
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
				});
		}

		$scope.login = function() {
			$rootScope.user = null;
			$cookies.remove('user');
			auth.login($scope.account)
				.then(function(data) {
					if (data._id) {
						$rootScope.user = data;
						$cookies.put('user', JSON.stringify(data), {
							expires: new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
						});
						$state.go('profile');
					}
				}, function(error) {
					Notification.error(error);
				});
		};

		$scope.logout = function() {
			$cookies.remove('user');
			$rootScope.user = null;
			$scope.loadedPictureUrl = false;
			$state.go('home');
			auth.logout().then(function() {});
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

app.directive('loginForm', [function() {
	return {
		restrict: 'E',
		templateUrl: 'views/login-form.html',
		controller: 'LoginController'
	};
}]);
