angular.module('Contests')
  .factory('ContestAPI', [
    '$resource',
    '$state',
    'Request',
    'Notification',
    'Upload',
    function ($resource, $state, Request, Notification, Upload) {
      var API = {
        create: Request.send('save', $resource('/api/v1/contest/create')),
        edit: Request.send('save', $resource('/api/v1/contest/:id/edit', { id: '@id' })),
        remove: Request.send('save', $resource('/api/v1/contest/:id/remove', { id: '@id' })),
        join: Request.send('save', $resource('/api/v1/contest/:id/join', { id: '@id' })),
        leave: Request.send('save', $resource('/api/v1/contest/:id/leave', { id: '@id' })),
        submit: Request.send('save', $resource('/api/v1/contest/:id/submit', { id: '@id' })),

        getList: Request.send('get', $resource('/api/v1/contest/list/:type/:from'), {ignoreThrottle: true}),
        getMetadata: Request.send('get', $resource('/api/v1/contest/:id/metadata')),
        getEvents: Request.send('get', $resource('/api/v1/contest/:id/events/:from')),
        getSubmissions: Request.send('get', $resource('/api/v1/contest/:id/submissions/:from')),
      }

      return {
        edit: function(id, params, callback) {
          params.id = id
          API.edit(params)
          .then(function() {
            Notification('Competição editada.')
            $state.go('contest', {id: id}, {reload: true})
          })
        },

        leave: function (id, callback) {
          API.leave({ id: id })
          .then(function () {
            Notification('Você saiu da competição.')
            $state.go('contests.open')
          })
        },

        join: function (id, password, team, callback) {
          API.join({ id: id, password: password, team: team })
          .then(function () {
            $state.go($state.current, {id: id}, {reload: true})
          })
        },

        remove: function (id, callback) {
          API.remove({
            id: id
          }).then(function (data) {
            Notification('Competição removida.')
            callback && callback(null, true)
          })
        },

        // Contest instance
        getContestMetadata: function(id, callback) {
          API.getMetadata({
            id: id
          }).then(function(data) {
            callback && callback(null, data)
          })
        },

        getContestEvents: function(id, startFrom, callback) {
          if (_.isFunction(startFrom)) callback = startFrom, startFrom = undefined
          API.getEvents({ id: id, from: startFrom })
          .then(function(data) {
            var submissions = _.chain(_.concat(data.accepted, data.rejected, data.pending))
              .map(function(o) {
                o = _.split(o, ',')
                o[3] = parseInt(o[3])
                return o
              })
              .sortBy(function(o) {
                return o[3]
              })
              .value()
            callback(null, submissions)
          })
        },

        getSubmissions: function(id, startFrom, callback) {
          API.getSubmissions({ id: id, from: startFrom })
          .then(function(data) {
            callback(null, data.submissions)
          })
        },

        submit: function (contestId, submission, callback) {
          var promise
          if (submission.codefile) {
            promise = Upload.upload({
              url: '/api/v1/contest/' + contestId + '/submit',
              data: {
                id: contestId,
                file: submission.codefile,
                problem: submission.problem,
                language: submission.language
              }
            })
          } else {
            promise = API.submit({
              id: contestId,
              code: submission.code,
              problem: submission.problem,
              language: submission.language
            })
          }
          promise.then(function (data) {
            Notification('Código enviado!')
            return callback(null, data.submission || data.data.submission)
          })
        },

        getList: function(type, last, callback) {
          API.getList({type: type, from: last}).then(function(data) {
            return callback(null, data.contests)
          })
        },
      }
    }
  ])
