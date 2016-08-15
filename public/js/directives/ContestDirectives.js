var app = angular.module('Contests')

/*
 * mrtContestLabel is a directive only to wrap spans responsable to show the contest name and other structures
 */
app.directive('mrtContestLabel', function () {
  return {
    restrict: 'E',
    scope: {
      adminFlag: '=',
      newFlag: '=',
      contest: '=',
    },
    templateUrl: 'views/misc/contest-label.html'
  }
})

/*
 * mrtContestList is the directive responsable to render a list of contest
 * Set to be used as element-only
 * has mrtPageWrapper as required for proper structure of html, but they have no logical dependency
 */
app.directive('mrtContestList', function () {
  return {
    restrict: 'E',
    required: 'mrtPageWrapper',
    scope: {
      filterType: '@', // Select the filter to apply over the list
      // optional - value = ['past', 'future', 'now', 'owned']
      emptyMessage: '=', // Message to display when list is empty
      // optional - String
      adminFlag: '=', // Span to indicate the user has admin properties over contest
      // optional - values = true/false
      newFlag: '=', // Span to indicate that contest is new (based on function declared on controller)
      // optional - values = true/false
      subTitle: '=', // Table's title
    // optional - String
    },
    templateUrl: 'views/contests/list/contest-list.html',
    controller: 'ContestListController'
  }
})

app.directive('mrtContestProgress', function () {
  return {
    restrict: 'E',
    templateUrl: 'views/misc/contest-progress.html',
    controller: function($scope, TimeState, ContestState, formatDurationFilter) {
      $scope.ContestState = ContestState

      var getWidths = _.throttle(function() {
        var total = (ContestState.contest.date_end - ContestState.contest.date_start)
        if (!ContestState.contest.hasBlind) ContestState.contest.blind_time = ContestState.contest.date_end
        if (!ContestState.contest.hasFrozen) ContestState.contest.frozen_time = ContestState.contest.blind_time
        var frozen = Math.floor((ContestState.contest.date_end - ContestState.contest.frozen_time) * 100 / total) || 0
        var blind = Math.floor((ContestState.contest.date_end - ContestState.contest.blind_time) * 100 / total) || 0
        return {
          frozen: frozen,
          blind: blind
        }
      }, 1000)

      $scope.getWidthOf = function(type) { return getWidths()[type] }
      $scope.getPercentage = function() {
        return (TimeState.server.now - ContestState.contest.date_start) * 100 /
          (ContestState.contest.date_end - ContestState.contest.date_start)
      }
      $scope.getClass = function() {
        if (ContestState.contest.isBlind) return 'md-warn'
        if (ContestState.contest.isFrozen) return 'md-accent'
        return 'md-primary'
      }
      $scope.showBar = function(type) {
        var now = TimeState.server.now
        if (type === 'frozen') {
          if (!ContestState.contest.hasFrozen) return false
          return now < ContestState.contest.frozen_time
        }
        if (type === 'blind') {
          if (!ContestState.contest.hasBlind) return false
          return now < ContestState.contest.blind_time
        }
        return true
      }

      $scope.getUptime = function() {
        var time = formatDurationFilter(Math.floor((TimeState.server.now - ContestState.contest.date_start) / 1000), true)
        if (TimeState.server.now < ContestState.contest.date_start) time += ' para começar'
        return time
      }
      $scope.getTimeLeft = function() {
        var time = formatDurationFilter(Math.floor((ContestState.contest.date_end - TimeState.server.now) / 1000), true)
        return time
      }
      $scope.getTotalTime = function() {
        var time = formatDurationFilter(Math.floor((ContestState.contest.date_end - ContestState.contest.date_start) / 1000), true)
        return time
      }

      $scope.isContestRunning = function() {
        return ContestState.contest.isRunning
      }
      $scope.hasContestEnded = function() {
        return ContestState.contest.hasEnded
      }
    },
  }
})
