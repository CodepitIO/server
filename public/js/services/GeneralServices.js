angular.module('General')
  .service('TimeState', function ($interval, $resource, Request) {
      var diff = 0, now
      var $scope = this

      $scope.server = {
        now: new Date(),
        static: new Date()
      }

      $interval(function () {
        now = (new Date()).getTime()
        $scope.server.now = new Date(now + diff)
      }, 1000)

      var GetServerTimeAPI = $resource('/api/v1/server/time', {})
      Request.send('get', GetServerTimeAPI)({}).then(function (data) {
        var serverDate = new Date(data.date)
        var clientDate = new Date()

        diff = Math.max(0, serverDate - clientDate)
        now = (new Date()).getTime()
        $scope.server.now = $scope.server.static = new Date(now + diff)
      })
    })
  .service('HistoryState', function ($rootScope, $state, $location) {
      var $scope = this
      var history = []
      var lastState = ''

      $scope.push = function (ev, to, toParams, from, fromParams) {
        if (from.name === '' || to.name === lastState) return
        lastState = ''
        history.push({state: from.name, params: fromParams, url: $location.url()})
      }

      $scope.pop = function() {
        if (_.isEmpty(history)) return null
        var last = _.last(history)
        lastState = last.state
        $state.go(last.state, last.params || {})
        history.pop()
        return last
      }

      $scope.isEmpty = function() {
        return _.isEmpty(history)
      }
    })
