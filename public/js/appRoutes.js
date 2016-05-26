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
			// Controller is set on the directive
			.state('contests.joined', {
				url: '/joined',
				templateUrl: 'views/contests/joined.html',
				mustBeLogged: true
			})
			.state('contests.create', {
				url: '/create',
				templateUrl: 'views/contests/create.html',
				controller: 'CreateContestController',
				mustBeLogged: true
			})
			.state('contests.edit', {
				url: '/edit',
				templateUrl: 'views/contests/edit.html',
				controller: 'EditContestController',
				mustBeLogged: true
			})
			.state('contest', {
				url: '^/contest/{id}',
				templateUrl: 'views/contests/contest.html',
				controller: 'ContestInstanceController'
			})
			.state('contest.scoreboard', {
				templateUrl: 'views/contests/contest.scoreboard.html',
				controller: 'ScoreboardController'
			})
			.state('contest.submit', {
				url: '/submit',
				templateUrl: 'views/contests/contest.submit.html',
				controller: 'SubmitController'
			})
			.state('contest.submissions', {
				url: '/submissions',
				templateUrl: 'views/contests/contest.submissions.html',
				controller: 'SubmissionsController'
			})
			.state('contest.catalog', {
				url: '/catalog',
				templateUrl: 'views/contests/contest.catalog.html',
				controller: 'CatalogController'
			})
			.state('register', {
				url: '^/register',
				templateUrl: 'views/account/register.html',
				controller: 'RegisterController',
				mustNotBeLogged: true
			})
			.state('profile', {
				url: '^/profile/{id}',
				templateUrl: 'views/account/profile.html',
				controller: 'ProfileController',
			})
			.state('profile.data', {
				url: '/data',
				templateUrl: 'views/account/profile.data.html'
			})
			.state('profile.teams', {
				url: '/teams',
				templateUrl: 'views/account/profile.teams.html'
			})
			.state('profile.posts', {
				url: '/posts?page',
				templateUrl: 'views/account/profile.posts.html',
				controller: 'ProfilePostsController'
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
				abstract: true,
				url: '^/problems/{id}',
				templateUrl: 'views/problem-view.html',
				controller: 'ProblemController',
			})
			.state('problems.view', {
				url: '/view',
				templateUrl: function($stateParams) {
					return 'problems/' + $stateParams.id + '.html';
				}
			});
	}
]);
