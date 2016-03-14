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
				url: '^/home',
				templateUrl: 'views/home.html'
			})
			.state('contests', {
				abstract: true,
				url: '^/contests',
				template: '<ui-view/>'
			})
			// Controller is set on the directive
			.state('contests.open', {
				url: '/open',
				templateUrl: 'views/contests/open.html',
			})
			// Controller is set on the directive
			.state('contests.past', {
				url: '/past',
				templateUrl: 'views/contests/past.html',
			})
			// Controller is set on the directive
			.state('contests.owned', {
				url: '/owned',
				templateUrl: 'views/contests/owned.html',
				mustBeLogged: true
			})
			.state('contests.create', {
				url: '/create',
				templateUrl: 'views/contests/create.html',
				controller: 'CreateContestController',
				mustBeLogged: true
			})
			.state('contest', {
				url: '^/contest/{id}',
				templateUrl: 'views/contests/contest.html',
				controller: 'SingleContestController'
			})
			.state('contest/edit', {
				url: '/edit',
				templateUrl: 'views/contests/edit.html',
				controller: 'EditContestController',
				mustBeLogged: true
			})
			.state('contest.scoreboard', {
				templateUrl: 'views/contests/contest.scoreboard.html',
			})
			.state('contest.submit', {
				url: '/submit',
				templateUrl: 'views/contests/contest.submit.html',
			})
			.state('contest.submissions', {
				url: '/submissions',
				templateUrl: 'views/contests/contest.submissions.html',
			})
			.state('contest.catalog', {
				url: '/catalog',
				templateUrl: 'views/contests/contest.catalog.html',
			})
			.state('register', {
				url: '^/register',
				templateUrl: 'views/register.html',
				controller: 'RegisterController',
				mustNotBeLogged: true
			})
			.state('profile', {
				url: '^/profile',
				templateUrl: 'views/profile.html',
				controller: 'ProfileController',
				mustBeLogged: true
			})
			.state('team', {
				url: '^/team/{id}',
				templateUrl: 'views/team.html',
				controller: 'TeamController',
				mustBeLogged: true
			})
			.state('submission', {
				url: '^/submission/{id}',
				templateUrl: 'views/submission.html',
				controller: 'SubmissionController'
			})
			.state('problems', {
				url: '^/problems/{id}',
				templateUrl: function($stateParams) {
					return 'problems/' + $stateParams.id + '.html';
				}
			});
	}
]);
