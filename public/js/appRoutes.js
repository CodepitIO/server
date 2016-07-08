angular.module('appRoutes', []).config([
  '$stateProvider',
  '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {
    //
    // For any unmatched url, redirect to /state1
    $urlRouterProvider.otherwise('home')
    //
    // Now set up the states
    $stateProvider
      .state('home', {
        url: '^/home',
        templateUrl: 'views/home.html'
      })
      .state('about', {
        url: '^/about',
        templateUrl: 'views/about.html'
      })
      .state('contests', {
        abstract: true,
        url: '^/contests',
        template: '<ui-view/>'
      })
      // Controller is set on the directive
      .state('contests.open', {
        url: '/open',
        templateUrl: 'views/contests/list/open.html'
      })
      // Controller is set on the directive
      .state('contests.past', {
        url: '/past',
        templateUrl: 'views/contests/list/past.html'
      })
      // Controller is set on the directive
      .state('contests.owned', {
        url: '/owned',
        templateUrl: 'views/contests/list/owned.html',
        authenticate: true
      })
      // Controller is set on the directive
      .state('contests.joined', {
        url: '/joined',
        templateUrl: 'views/contests/list/joined.html',
        authenticate: true
      })
      .state('contests.create', {
        url: '/create',
        templateUrl: 'views/contests/settings/contest.create.html',
        authenticate: true
      })
      .state('contest', {
        abstract: true,
        url: '^/contest/:id',
        templateUrl: 'views/contests/contest/contest.html',
        controller: 'ContestController'
      })
      .state('contest.scoreboard', {
        url: '/view',
        title: 'Placar'
      })
      .state('contest.submit', {
        url: '/submit',
        title: 'Submeter',
        authenticate: true
      })
      .state('contest.submissions', {
        url: '/submissions',
        title: 'Submissões',
        authenticate: true
      })
      .state('contest.edit', {
        url: '/edit',
        title: 'Editar',
        authenticate: true
      })
      .state('register', {
        url: '^/register',
        templateUrl: 'views/user/register.html',
        controller: 'RegisterController',
        authenticate: false
      })
      .state('profile', {
        url: '^/profile/:id',
        templateUrl: 'views/user/profile.html',
        controller: 'ProfileController'
      })
      .state('profile.teams', {
        url: '/teams',
        templateUrl: 'views/user/profile.teams.html',
        controller: 'ProfileTeamsController'
      })
      .state('profile.posts', {
        url: '/posts?page',
        templateUrl: 'views/user/profile.posts.html',
        controller: 'ProfilePostsController'
      })
      .state('team', {
        url: '^/team/:id',
        templateUrl: 'views/team/team.html',
        controller: 'TeamController'
      })
      .state('submission', {
        url: '^/submission/:id',
        templateUrl: 'views/submission.html',
        controller: 'SubmissionController'
      })
      .state('problems', {
        abstract: true,
        url: '^/problems/:id?index',
        templateUrl: 'views/problem-view.html',
        controller: 'ProblemController',
        resolve: {
          problem: ['$q', '$stateParams', 'ProblemsAPI', function($q, $stateParams, ProblemsAPI) {
            var deferred = $q.defer()
            ProblemsAPI.get($stateParams.id, function (err, data) {
              if (err) deferred.reject(err)
              else deferred.resolve(data)
            })
            return deferred.promise
          }]
        }
      })
      .state('problems.view', {
        url: '/view',
        templateProvider: ['$templateFactory', 'problem', function($templateFactory, problem) {
          return $templateFactory.fromUrl(problem.url);
        }],
      })
  }
])
