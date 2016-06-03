angular.module('Post', [])
angular.module('Catalog', [])
angular.module('Contests', [])
angular.module('General', [])
angular.module('Login', [])
angular.module('Problems', [])
angular.module('Submission', [])
angular.module('Team', [])
angular.module('Tag', [])
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
  'Catalog',
  'Contests',
  'General',
  'Login',
  'Problems',
  'Submission',
  'Tag',
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
  'amMoment',
  'UserState',
  'HistoryState',
  function ($rootScope, $cookies, amMoment, userState, historyState) {
    amMoment.changeLocale('pt-br')
    try {
      $rootScope.user = JSON.parse($cookies.get('user'))
    } catch (err) {
      $rootScope.user = null
    }
    userState.reset()
    $rootScope.$on('$stateChangeSuccess', historyState.push)
  }
])
