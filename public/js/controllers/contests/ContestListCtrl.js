angular.module('Contests')
  .controller('ContestListController', [
    '$scope',
    '$rootScope',
    '$location',
    'TimeState',
    'ContestAPI',
    'UserState',
    function ($scope, $rootScope, $location, TimeState, ContestAPI, UserState) {
      $scope.loadingData = true
      $scope.contests = []
      $scope.filterType = $scope.filterType || $location.path().split('/')[2] || 'open'

      switch ($scope.filterType) {
        case 'now':
        case 'future':
        case 'joined':
          $scope.predicate = 'date_start'
          $scope.reverse = false
          break
        case 'owned':
          $scope.predicate = 'date_start'
          $scope.reverse = true
          break
        case 'past':
        default:
          $scope.predicate = 'date_end'
          $scope.reverse = true
          break
      }

      var lastQueryDate = 0
      $scope.fetchData = function () {
        // skip it if we're already loading
        if ($scope.loadingNewPage) return
        // skip if it it's not the first load and this is not a past filter
        if (!$scope.loadingData && $scope.filterType !== 'past') return

        $scope.loadingNewPage = true
        ContestAPI.getList($scope.filterType, lastQueryDate, function (err, contests) {
          if (contests.length > 0) {
            lastQueryDate = new Date(_.last(contests).date_end).getTime()
          }
          for (var i = 0; i < contests.length; i++) {
            var start = contests[i].date_start = new Date(contests[i].date_start)
            var end = contests[i].date_end = new Date(contests[i].date_end)
            contests[i].duration = Math.floor((end - start) / 1000)
            contests[i].isAdmin = (contests[i].author === UserState.getId())
            $scope.contests.push(contests[i])
          }
          $scope.loadingData = $scope.loadingNewPage = false
        })
      }
      $scope.fetchData()

      $scope.order = function (predicate) {
        $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false
        $scope.predicate = predicate
      }

      $scope.isInFuture = function (date) {
        return new Date(date) > TimeState.server.static
      }

      $scope.isInPast = function (date) {
        return new Date(date) <= TimeState.server.static
      }

      $scope.isNewContest = function (date) {
        return ((TimeState.server.static - new Date(date)) / 60000) <= 10
      }
    }
  ])
