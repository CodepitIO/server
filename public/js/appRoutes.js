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
        templateUrl: 'views/contests/open.html'
      })
      // Controller is set on the directive
      .state('contests.past', {
        url: '/past',
        templateUrl: 'views/contests/past.html'
      })
      // Controller is set on the directive
      .state('contests.owned', {
        url: '/owned',
        templateUrl: 'views/contests/owned.html',
        authenticate: true
      })
      // Controller is set on the directive
      .state('contests.joined', {
        url: '/joined',
        templateUrl: 'views/contests/joined.html',
        authenticate: true
      })
      .state('contests.create', {
        url: '/create',
        templateUrl: 'views/contests/create.html',
        controller: 'ContestSettingsController',
        authenticate: true
      })
      .state('contest', {
        url: '^/contest/:id',
        templateUrl: 'views/contests/contest.html',
        controller: 'ContestController'
      })
      .state('contest.scoreboard', {
        templateUrl: 'views/contests/contest.scoreboard.html',
        controller: 'ContestScoreboardController'
      })
      .state('contest.submit', {
        url: '/submit',
        templateUrl: 'views/contests/contest.submit.html',
        controller: 'ContestSubmitController'
      })
      .state('contest.submissions', {
        url: '/submissions',
        templateUrl: 'views/contests/contest.submissions.html',
        controller: 'ContestSubmissionsController',
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
        url: '^/problems/:id',
        templateUrl: 'views/problems/problem-view.html',
        controller: 'ProblemController'
      })
      .state('problems.view', {
        url: '/view',
        templateUrl: function ($stateParams) {
          return 'problems/' + $stateParams.id + '.html'
        }
      })
  }
])
