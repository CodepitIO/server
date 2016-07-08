angular.module('Contests').controller('ContestScoreboardController', [
  '$scope',
  'ContestState',
  function ($scope, ContestState) {
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

    $scope.getCellClass = function(rep, problem) {
      var score = _.get(ContestState.scoreboard, [rep, problem])
      if (!score) return ''
      var cls = ''
      if (score.accepted) {
        cls = 'accepted-cell'
        if (ContestState.firstAccepted[problem].rep === rep) cls += ' first-accepted'
        return cls
      }
      if (score.pending > 0) cls += 'pending-cell '
      if (score.err > 0) cls += 'rejected-cell '
      return cls
    }

    $scope.getRowResults = function(rep, type) {
      return _.get(ContestState.scores, [rep, type], '0')
    }
  }
])
