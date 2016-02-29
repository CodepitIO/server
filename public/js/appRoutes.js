angular.module('appRoutes', []).config([
	'$stateProvider',
	'$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		//
		// For any unmatched url, redirect to /state1
		$urlRouterProvider.otherwise("/state1");
		//
		// Now set up the states
		$stateProvider
			.state('state1', {
				url: "/state1",
				templateUrl: "partials/state1.html"
			})
			.state('state1.list', {
				url: "/list",
				templateUrl: "partials/state1.list.html",
				controller: function($scope) {
					$scope.items = ["A", "List", "Of", "Items"];
				}
			})
			.state('state2', {
				url: "/state2",
				templateUrl: "partials/state2.html"
			})
			.state('state2.list', {
				url: "/list",
				templateUrl: "partials/state2.list.html",
				controller: function($scope) {
					$scope.things = ["A", "Set", "Of", "Things"];
				}
			});
	}
]);

/*angular.module('appRoutes', []).config([
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
*/
