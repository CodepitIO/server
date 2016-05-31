angular.module('General')
  .service('TimeSharedState', [
    '$interval',
    '$resource',
    'RequestAPI',
    function ($interval, $resource, request) {
      var diff = 0,
        now
      var server = {
        dynamic: new Date(),
        static: new Date()
      }

      $interval(function () {
        now = (new Date()).getTime()
        server.dynamic = new Date(now + diff)
      }, 5000)

      var GetServerTimeAPI = $resource('/api/v1/server/time', {})
      request.send('get', GetServerTimeAPI)({}).then(function (data) {
        var serverDate = new Date(data.date)
        var clientDate = new Date()

        diff = Math.max(0, serverDate - clientDate)
        now = (new Date()).getTime()
        server.dynamic = server.static = new Date(now + diff)
      })

      return {
        server: server
      }
    }
  ])
