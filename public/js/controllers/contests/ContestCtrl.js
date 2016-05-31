angular.module('Contests')
  .controller('ContestController', [
    '$scope',
    '$state',
    '$stateParams',
    'ContestState',
    function ($scope, $state, $stateParams, contestState) {
      // Redirect to scoreboard when in path /contest
      if ($state.is('contest')) {
        $state.go('.scoreboard')
      }
      $scope.state = $state

      contestState.reset()

      // Fetch contest data to contestService
      var contestId = $stateParams.id
      contestState.getScoreboard(contestId, function (err, ok) {
        if (!ok) $state.go('contests.open')
        else $scope.contest = contest.data
      })
    }
  ])
