angular.module('Contests')
  .controller('ContestScoreboardController',
  function ($scope, $mdDialog, $mdMedia, UserState, ContestState) {
    $scope.getCellAttempts = function(rep, problem) {
      var score = _.get(ContestState.scoreboard, [rep, problem])
      if (!score) return ''
      return score.err + (score.accepted? 1 : 0)
    }

    $scope.getCellPenalty = function(rep, problem) {
      var score = _.get(ContestState.scoreboard, [rep, problem])
      if (!score) return ''
      return (score.accepted) ? score.time : '--'
    }

    $scope.isRep = function(rep) {
      if (!ContestState.contestants[rep].handles) {
        return UserState.isUser(rep)
      }
      var ids = _.map(ContestState.contestants[rep].handles, 0)
      return UserState.isInArray(ids)
    }

    $scope.getCellClass = function(rep, problem) {
      var score = _.get(ContestState.scoreboard, [rep, problem])
      if (!score) return ''
      var cls = ''
      if (UserState.isAdmin() || ContestState.contest.isContestAdmin) {
        cls += 'spy-cell '
      }
      if (score.accepted) {
        cls += 'accepted-cell '
        if (ContestState.firstAccepted[problem].rep === rep) cls += 'first-accepted '
        if (score.upsolved) cls += 'upsolved ';
        return cls
      }
      if (score.pending > 0) cls += 'pending-cell '
      if (score.err > 0) cls += 'rejected-cell '
      return cls
    }

    $scope.spySubmissions = function(rep, problem) {
      if (!_.get(ContestState.scoreboard, [rep, problem])) return
      if (UserState.isAdmin() || ContestState.contest.isContestAdmin) {
        $mdDialog.show({
          controller: 'ContestSpyController',
          locals: { SpyData: {
            contest: ContestState.id,
            rep: rep,
            problem: problem
          } },
          templateUrl: 'views/contests/contest/contest.spy.html',
          clickOutsideToClose: true,
          fullscreen: ($mdMedia('sm') || $mdMedia('xs')),
        })
      }
    }

    $scope.getRowResults = function(rep, type) {
      return _.get(ContestState.scores, [rep, type], '0')
    }
  })
  .controller('ContestSpyController', function($scope, ContestAPI, Verdict, Languages, SpyData) {
    $scope.loading = true
    $scope.submissions = []
    $scope.verdict = Verdict
    $scope.languages = Languages
    ContestAPI.getRepProblemSubmissions(SpyData.contest, SpyData.rep, SpyData.problem, function(err, submissions) {
      $scope.submissions = submissions
      $scope.loading = false
    })
  })
