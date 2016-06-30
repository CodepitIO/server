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
