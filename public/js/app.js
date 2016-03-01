var mrtApp = angular.module('mrtApp', [
		'mrtApp.templates',
		'angularMoment',
		'ui.router',
		'ui-notification',
		'ui.bootstrap',
		'appRoutes',
		'ngAnimate',
		'angular-toArrayFilter',
		'ngResource',
		'ngCookies',
		'ui.slider',
		'ui.sortable',
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
	])
	.config(['NotificationProvider', '$tooltipProvider', function(NotificationProvider, $tooltipProvider) {
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
	}])
	.directive('confirmedClick', [function() {
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
	}])
	.run([
		//'$route',
		'$cookies',
		'$location',
		'$http',
		'$window',
		'$rootScope',
		'$interval',
		'Notification',
		'$templateCache',
		'amMoment',
		function( /*$route, */ $cookies, $location, $http, $window, $rootScope, $interval, Notification, tc, amMoment) {
			amMoment.changeLocale('pt-br');
			try {
				$rootScope.user = JSON.parse($cookies.get('user'));
			} catch (err) {
				$rootScope.user = null;
			}
			$rootScope.intervalPromises = [];
			var nextPath = $location.path();
			/*if ($route.routes[nextPath]) {
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
			}*/

			$rootScope.$on('$locationChangeStart', function(ev, next, current) {
				var nextPath = $location.path();
				for (var i = 0; i < $rootScope.intervalPromises.length; i++) {
					$interval.cancel($rootScope.intervalPromises[i]);
				}
				$rootScope.intervalPromises = [];
				/*if ($route.routes[nextPath]) {
					var mustNotBeLogged = $route.routes[nextPath].mustNotBeLogged;
					var mustBeLogged = $route.routes[nextPath].mustBeLogged;
					var isLogged = !!$rootScope.user;
					if (mustNotBeLogged && isLogged) {
						$location.path('/');
					} else if (mustBeLogged && !isLogged) {
						$location.path('/');
					}
				}*/
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
