// Declare all app modules
angular.module('Account', [])
angular.module('Blog', [])
angular.module('Catalog', [])
angular.module('Contests', [])
angular.module('General', [])
angular.module('Login', [])
angular.module('Problems', [])
angular.module('Submission', [])
angular.module('Team', [])
angular.module('Tag', [])
angular.module('Util', [])

var mrtApp = angular.module('mrtApp', [
  'mrtApp.templates',
  'angularMoment',
  'ngMaterial',
  'ngResource',
  'ngCookies',
  'ngFileUpload',
  'ui.router',
  'ui-notification',
  'ui.bootstrap',
  'ui.slider',
  'ui.sortable',
  'ui.codemirror',
  'appRoutes',
  'infinite-scroll',
  'textAngular',

  'Account',
  'Blog',
  'Catalog',
  'Contests',
  'General',
  'Login',
  'Problems',
  'Submission',
  'Tag',
  'Team',
  'Util'
])
  .config([
    'NotificationProvider',
    '$uibTooltipProvider',
    '$mdThemingProvider',
    function (NotificationProvider, $uibTooltipProvider, $mdThemingProvider) {
      NotificationProvider.setOptions({
        delay: 5000,
        startTop: 20,
        startRight: 10,
        verticalSpacing: 20,
        horizontalSpacing: 20,
        positionX: 'right',
        positionY: 'bottom'
      })
      $uibTooltipProvider.setTriggers({
        'toggleContestAccessEvent': 'toggleContestAccessEvent'
      })
      $mdThemingProvider.theme('default')
        .primaryPalette('cyan')
        .accentPalette('blue-grey', {
          'default': '400',
          'hue-1': '100',
          'hue-2': '600',
          'hue-3': '900'
        })
        .warnPalette('red')

      $mdThemingProvider.theme('progressBarTheme')
        .primaryPalette('blue')
        .accentPalette('orange')
        .warnPalette('red')
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
    'AccountSharedState',
    function ($cookies, $location, $http, $window, $rootScope, $interval, Notification, tc, amMoment, accountState) {
      amMoment.changeLocale('pt-br')
      try {
        $rootScope.user = JSON.parse($cookies.get('user'))
        $rootScope.emailHash = $rootScope.user.local.emailHash
      } catch (err) {
        $rootScope.user = null
        $rootScope.emailHash = ''
      }
      $rootScope.intervalPromises = []
      accountState.reset()
      var nextPath = $location.path()
      /*if ($route.routes[nextPath]) {
      	var mustNotBeLogged = $route.routes[nextPath].mustNotBeLogged
      	var mustBeLogged = $route.routes[nextPath].mustBeLogged
      	var isLogged = !!$rootScope.user
      	if (mustNotBeLogged && isLogged) {
      		$location.path('/')
      		Notification.info('Você não pode estar logado para ver esta página.')
      	} else if (mustBeLogged && !isLogged) {
      		$location.path('/')
      		Notification.info('Você deve estar logado para ver esta página.')
      	}
      }*/

      $rootScope.$on('$locationChangeStart', function (ev, next, current) {
        var nextPath = $location.path()
        for (var i = 0; i < $rootScope.intervalPromises.length; i++) {
          $interval.cancel($rootScope.intervalPromises[i])
        }
        $rootScope.intervalPromises = []
      /*if ($route.routes[nextPath]) {
      	var mustNotBeLogged = $route.routes[nextPath].mustNotBeLogged
      	var mustBeLogged = $route.routes[nextPath].mustBeLogged
      	var isLogged = !!$rootScope.user
      	if (mustNotBeLogged && isLogged) {
      		$location.path('/')
      	} else if (mustBeLogged && !isLogged) {
      		$location.path('/')
      	}
      }*/
      })
      $rootScope.not = function (func) {
        return function (item) {
          return !func(item)
        }
      }
      $rootScope.isActive = function (viewLocation) {
        viewLocation = '^' + viewLocation.replace('\/', '\\\/') + '$'
        return (new RegExp(viewLocation)).test($location.path())
      }
    }
  ])
