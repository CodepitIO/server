var mrtApp = angular.module('mrtApp', [
	'mrtApp.templates',
	'angularMoment',
	'angular-toArrayFilter',
	'ngRoute',
	'appRoutes',
	'ngAnimate',
	'ngResource',
	'ui.bootstrap',
	'ui.slider',
	'ui.sortable',
	'ui-notification',
	'btford.socket-io',

	'ContestsCtrl',
	'CreateContestCtrl',
	'EditContestCtrl',
	'HomeCtrl',
	'LoginCtrl',
	'OwnedContestsCtrl',
	'ProblemsCtrl',
	'ProfileCtrl',
	'RegisterCtrl',
	'SingleContestCtrl',
	'SubmissionCtrl',
	'TeamCtrl',

	'AccountService',
	'AuthService',
	'CatalogService',
	'ContestsService',
	'GlobalService',
	'ProblemsService',
	'SingleContestService',
	'SubmissionService',
	'TagService',
	'TeamService',
	'UtilService',

	'SocketService',
]).constant('angularMomentConfig', {
	preprocess: 'utc',
	timezone: 'America/Recife' // optional
}).service('authService', [
	'$rootScope',
	function($rootScope) {
		return {
			getUserFlags: function() {
				return $rootScope.user ? $rootScope.user.flags : 0;
			}
		};
	}
]).config(['NotificationProvider', '$tooltipProvider', function(NotificationProvider, $tooltipProvider) {
	NotificationProvider.setOptions({
		delay: 5000,
		startTop: 20,
		startRight: 10,
		verticalSpacing: 20,
		horizontalSpacing: 20,
		positionX: 'right',
		positionY: 'bottom'
	});
	$tooltipProvider.setTriggers({
		'toggleContestAccessEvent': 'toggleContestAccessEvent'
	});
}]).directive('restrict', [
	'authService',
	'GlobalFlags',
	function(authService, gflags) {
		return {
			restrict: 'A',
			prioriry: 100000,
			scope: false,
			compile: function(element, attr, linker) {
				var accessDenied = true;
				var flags = authService.getUserFlags();
				var attributes = attr.access.split(' ');
				for (var i in attributes) {
					if ((flags & gflags[attributes[i]]) === gflags[attributes[i]]) {
						accessDenied = false;
					}
				}
				if (accessDenied) {
					angular.forEach(element.children(), function(elm) {
						try {
							elm.remove();
						} catch (ignore) {}
					});
					element.remove();
				}
			}
		};
	}
]).directive('confirmedClick', [function() {
	return {
		link: function(scope, element, attr) {
			var msg = attr.ngConfirmClick || 'Você tem certeza?';
			var clickAction = attr.confirmedClick;
			element.bind('click', function(event) {
				if (window.confirm(msg)) {
					scope.$eval(clickAction);
				}
			});
		}
	};
}]).run([
	'$route',
	'$location',
	'$http',
	'$window',
	'$rootScope',
	'$interval',
	'Notification',
	'$templateCache',
	'amMoment',
	function($route, $location, $http, $window, $rootScope, $interval, Notification, tc, amMoment) {
		amMoment.changeLocale('pt-br');
		$rootScope.loadingUser = true;
		$rootScope.intervalPromises = [];
		$http.get('/api/check_login').success(function(data) {
			$rootScope.user = data;
			$rootScope.loadingUser = false;
			var nextPath = $location.path();
			if ($route.routes[nextPath]) {
				var mustNotBeLogged = $route.routes[nextPath].mustNotBeLogged;
				var mustBeLogged = $route.routes[nextPath].mustBeLogged;
				var isLogged = !!$rootScope.user;
				if (mustNotBeLogged && isLogged) {
					$location.path('/');
					Notification.info('Você não pode estar logado para ver esta página.');
				} else if (mustBeLogged && !isLogged) {
					$location.path('/');
					Notification.info('Você deve estar logado para ver esta página.');
				}
			}
		});
		$rootScope.$on('$locationChangeStart', function(ev, next, current) {
			var nextPath = $location.path();
			for (var i = 0; i < $rootScope.intervalPromises.length; i++) {
				$interval.cancel($rootScope.intervalPromises[i]);
			}
			$rootScope.intervalPromises = [];
			if ($route.routes[nextPath]) {
				var mustNotBeLogged = $route.routes[nextPath].mustNotBeLogged;
				var mustBeLogged = $route.routes[nextPath].mustBeLogged;
				var isLogged = !!$rootScope.user;
				if (mustNotBeLogged && isLogged) {
					$location.path('/');
				} else if (mustBeLogged && !isLogged) {
					$location.path('/');
				}
			}
		});
		$rootScope.not = function(func) {
			return function(item) {
				return !func(item);
			};
		};
		$rootScope.isActive = function(viewLocation) {
			viewLocation = '^' + viewLocation.replace('\/', '\\\/') + '$';
			return (new RegExp(viewLocation)).test($location.path());
		};
	}
]);
