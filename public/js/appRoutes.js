angular.module('appRoutes', []).config([
	'$routeProvider',
	'$locationProvider',
	function($routeProvider, $locationProvider) {
		$routeProvider // home page
			.when('/', {
			templateUrl: 'views/home.html',
			controller: 'HomeController'
		}).when('/register', {
			templateUrl: 'views/register.html',
			controller: 'RegisterController',
			mustNotBeLogged: true
		}).when('/profile', {
			templateUrl: 'views/profile.html',
			controller: 'ProfileController',
			mustBeLogged: true
		}).when('/team/:id', {
			templateUrl: 'views/team.html',
			controller: 'TeamController',
			mustBeLogged: true
		}).when('/contests/create', {
			templateUrl: 'views/contests/create.html',
			controller: 'CreateContestController',
			mustBeLogged: true
		}).when('/contests/created', {
			templateUrl: 'views/contests/owner.html',
			controller: 'OwnedContestsController',
			mustBeLogged: true
		}).when('/contest/:id/edit', {
			templateUrl: 'views/contests/edit.html',
			controller: 'EditContestController',
			mustBeLogged: true
		}).when('/contest/:id/info', {
			templateUrl: 'views/contests/info.html',
			controller: 'InfoContestController',
			mustBeLogged: true
		}).when('/contest/:id', {
			templateUrl: 'views/contests/view.html',
			controller: 'SingleContestController'
		}).when('/contests/open', {
			templateUrl: 'views/contests/open.html',
			controller: 'ContestsController'
		}).when('/contests/past', {
			templateUrl: 'views/contests/past.html',
			controller: 'ContestsController'
		}).when('/submission/:id', {
			templateUrl: 'views/submission.html',
			controller: 'SubmissionController'
		}).when('/problems/:id', {
			templateUrl: function(attr) {
				return 'problems/' + attr.id + '.html';
			}
		}).otherwise({
			redirectTo: '/'
		});
		$locationProvider.html5Mode(true);
	}
]).config([
	'$locationProvider',
	function($locationProvider) {
		$locationProvider.hashPrefix('!');
	}
]);
