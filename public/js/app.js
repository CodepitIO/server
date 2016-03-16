// Declare all app modules
angular.module('Account', []);
angular.module('Auth', []);
angular.module('Catalog', []);
angular.module('ContestInstance', []);
angular.module('Contests', []);
angular.module('CreateContest', []);
angular.module('EditContest', []);
angular.module('General', []);
angular.module('Home', []);
angular.module('JoinContest', []);
angular.module('Login', []);
angular.module('Problems', []);
angular.module('Profile', []);
angular.module('Register', []);
angular.module('Submission', []);
angular.module('Team', []);
angular.module('Socket', []);
angular.module('Tag', []);
angular.module('Util', []);

var mrtApp = angular.module('mrtApp', [
		'mrtApp.templates',
		'angularMoment',
		'ngAnimate',
		'ngMaterial',
		'ngResource',
		'ngCookies',
		'ui.router',
		'ui-notification',
		'ui.bootstrap',
		'ui.slider',
		'ui.sortable',
		'ui.codemirror',
		'appRoutes',
		'angular-toArrayFilter',
		'btford.socket-io',

		'Account',
		'Auth',
		'Catalog',
		'Contests',
		'ContestInstance',
		'CreateContest',
		'EditContest',
		'General',
		'Home',
		'JoinContest',
		'Login',
		'Problems',
		'Profile',
		'Register',
		'Submission',
		'Tag',
		'Team',
		'Util',
	])
	.config([
		'NotificationProvider',
		'$tooltipProvider',
		'$mdThemingProvider',
		function(NotificationProvider, $tooltipProvider, $mdThemingProvider) {
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
			$mdThemingProvider.theme('default')
				.primaryPalette('cyan')
				.accentPalette('blue-grey', {
		      'default': '400',
		      'hue-1': '100',
		      'hue-2': '600',
		      'hue-3': '900'
		    })
				.warnPalette('red');
		}
	])
	.run([
		'$cookies',
		'$location',
		'$http',
		'$window',
		'$rootScope',
		'$interval',
		'Notification',
		'$templateCache',
		'amMoment',
		function($cookies, $location, $http, $window, $rootScope, $interval, Notification, tc, amMoment) {
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
