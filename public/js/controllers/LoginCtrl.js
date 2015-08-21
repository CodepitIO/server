var app = angular.module('LoginCtrl', []);
app.controller('LoginController', [
	'$scope',
	'$rootScope',
	'$location',
	'Notification',
	'UtilFactory',
	'AuthFactory',
	'AccountFactory',
	function($scope, $rootScope, $location, Notification, util, auth, account) {
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
			auth.login($scope.account)
				.then(function(data) {
					if (data._id) {
						$rootScope.user = data;
						$location.path('/profile');
					}
				}, function(error) {
					Notification.error(error);
				});
		};

		$scope.logout = function() {
			auth.logout()
				.then(function(data) {
					$rootScope.user = null;
					$location.path('/');
					$scope.loadedPictureUrl = false;
				});
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
