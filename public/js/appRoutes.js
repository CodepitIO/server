angular.module('appRoutes', []).config([
	'$stateProvider',
	'$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		//
		// For any unmatched url, redirect to /state1
		$urlRouterProvider.otherwise('home');
		//
		// Now set up the states
		$stateProvider
			.state('home', {
				url: '/home',
				templateUrl: 'views/home.html'
			})
			.state('contests/open', {
				url: '/contests/open',
				templateUrl: 'views/contests/open.html',
				controller: 'ContestsController'
			})
			.state('contests/past', {
				url: '/contests/past',
				templateUrl: 'views/contests/past.html',
				controller: 'ContestsController'
			})
			.state('contests/created', {
				url: '/contests/created',
				templateUrl: 'views/contests/owner.html',
				controller: 'OwnedContestsController',
				mustBeLogged: true
			})
			.state('contests/create', {
				url: '/contests/create',
				templateUrl: 'views/contests/create.html',
				controller: 'CreateContestController',
				mustBeLogged: true
			})
			.state('register', {
				url: '/register',
				templateUrl: 'views/register.html',
				controller: 'RegisterController',
				mustNotBeLogged: true
			})
			.state('profile', {
				url: '/profile',
				templateUrl: 'views/profile.html',
				controller: 'ProfileController',
				mustBeLogged: true
			})
			.state('team', {
				url: '/team/{id}',
				templateUrl: 'views/team.html',
				controller: 'TeamController',
				mustBeLogged: true
			})
			.state('contest', {
				url: '/contest/{id}',
				templateUrl: 'views/contests/view.html',
				controller: 'SingleContestController'
			})
			.state('contest/edit', {
				url: '/contest/{id}/edit',
				templateUrl: 'views/contests/edit.html',
				controller: 'EditContestController',
				mustBeLogged: true
			})
			.state('submission', {
				url: '/submission/{id}',
				templateUrl: 'views/submission.html',
				controller: 'SubmissionController'
			})
			.state('problems', {
				url: '/problems/{id}',
				templateUrl: function($stateParams) {
					return 'problems/' + $stateParams.id + '.html';
				}
			});
	}
]);

/*angular.module('appRoutes', []).config([
	'$routeProvider',
	'$locationProvider',
	function($routeProvider, $locationProvider) {

		$locationProvider.html5Mode(true);
	}
]).config([
	'$locationProvider',
	function($locationProvider) {
		$locationProvider.hashPrefix('!');
	}
]);
*/
