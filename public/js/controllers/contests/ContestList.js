angular.module('Contests')
  .controller('ContestListController', [
    '$scope',
    '$rootScope',
    '$location',
    'TimeFactory',
    function ($scope, $rootScope, $location, time) {
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

      var lastQueryDate
      $scope.fetchData = function () {
        // skip it if we're already loading
        if ($scope.loadingNewPage) return
        // skip if it it's not the first load and this is not a past filter
        if (!$scope.loadingData && $scope.filterType !== 'past') return

        $scope.loadingNewPage = true
        contestPromise = contests.getByFilter({
          filter: $scope.filterType,
          lastQueryDate: lastQueryDate
        })

        contestPromise.then(function (data) {
          if (data.contests.length > 0) {
            lastQueryDate = data.contests[data.contests.length - 1].date_end
          }
          for (var i = 0; i < data.contests.length; i++) {
            var start = data.contests[i].date_start = new Date(data.contests[i].date_start)
            var end = data.contests[i].date_end = new Date(data.contests[i].date_end)
            data.contests[i].duration = Math.floor((end - start) / 1000)
            $scope.contests.push(data.contests[i])
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
        return new Date(date) > time.server.static
      }

      $scope.isInPast = function (date) {
        return new Date(date) <= time.server.static
      }

      $scope.isNewContest = function (date) {
        return ((time.server.static - new Date(date)) / 60000) <= 10
      }
    }
  ])
