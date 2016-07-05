angular.module('Post', [])
angular.module('Contests', [])
angular.module('General', [])
angular.module('Login', [])
angular.module('Problems', [])
angular.module('Submission', [])
angular.module('Team', [])
angular.module('User', [])

angular.module('mrtApp', [
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
  'infinite-scroll',
  'textAngular',
  'vcRecaptcha',
  'appRoutes',

  'Post',
  'Contests',
  'General',
  'Login',
  'Problems',
  'Submission',
  'Team',
  'User'
])
.config([
  'NotificationProvider',
  '$uibTooltipProvider',
  '$mdThemingProvider',
  'vcRecaptchaServiceProvider',
  'Config',
  function (NotificationProvider, $uibTooltipProvider, $mdThemingProvider, vcRecaptchaServiceProvider, Config) {
    vcRecaptchaServiceProvider.setSiteKey(Config.RecaptchaKey)
    NotificationProvider.setOptions(Config.NotificationOptions)
    $uibTooltipProvider.setTriggers(Config.TooltipOptions)
    _.each(Config.Themes, function(val, key) {
      $mdThemingProvider.theme(key)
        .primaryPalette(val.PrimaryPalette.color, val.PrimaryPalette.opts)
        .accentPalette(val.AccentPalette.color, val.AccentPalette.opts)
        .warnPalette(val.WarnPalette.color, val.WarnPalette.opts)
    })
  }
])
.run([
  '$rootScope',
  '$cookies',
  '$state',
  'amMoment',
  'UserState',
  'HistoryState',
  function ($rootScope, $cookies, $state, amMoment, UserState, HistoryState) {
    amMoment.changeLocale('pt-br')
    $rootScope.title = 'Codepit'
    $rootScope.user = UserState
    $rootScope.$on('$stateChangeSuccess', HistoryState.push)
    $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
      if (toState.title) $rootScope.title = toState.title + ' - Codepit'
      else $rootScope.title = 'Codepit'
      if ((toState.authenticate === true && !UserState.isAuthenticated()) ||
          (toState.authenticate === false && UserState.isAuthenticated())) {
        $state.transitionTo("home");
        event.preventDefault();
      }
  });
  }
])
