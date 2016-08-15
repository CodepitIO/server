angular.module('Contests')
  .factory('ContestAPI', function ($resource, $state, Request, Notification, Upload) {
      var API = {
        create: Request.send('save', $resource('/api/v1/contest/create')),
        edit: Request.send('save', $resource('/api/v1/contest/:id/edit', { id: '@id' })),
        remove: Request.send('save', $resource('/api/v1/contest/:id/remove', { id: '@id' })),
        join: Request.send('save', $resource('/api/v1/contest/:id/join', { id: '@id' })),
        leave: Request.send('save', $resource('/api/v1/contest/:id/leave', { id: '@id' })),
        submit: Request.send('save', $resource('/api/v1/contest/:id/submit', { id: '@id' })),

        getList: Request.send('get', $resource('/api/v1/contest/list/:type/:from'), {ignoreThrottle: true}),
        getMetadata: Request.send('get', $resource('/api/v1/contest/:id/metadata'), {ignoreThrottle: true}),
        getEvents: Request.send('get', $resource('/api/v1/contest/:id/events/:from'), {ignoreThrottle: true}),
        getSubmissions: Request.send('get', $resource('/api/v1/contest/:id/submissions/:from'), {ignoreThrottle: true}),
      }

      return {
        edit: function(id, params, callback) {
          params.id = id
          API.edit(params)
          .then(function(data) {
            Notification('Competição editada.')
            $state.go('contest.scoreboard', {id: id}, {reload: true})
          }, function(err) {
            callback && callback(err)
          })
        },

        create: function(params, callback) {
          API.create(params)
          .then(function(data) {
            Notification('Competição criada.')
            $state.go('contest.scoreboard', {id: data.id})
          }, function(err) {
            callback && callback(err)
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
            Notification.success('Inscrito com sucesso na competição.')
            $state.go($state.current, {id: id}, {reload: true})
          }, function() {
            callback && callback()
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
          }, function(err) {
            return callback && callback(err)
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
            return callback && callback(null, data.submission || data.data.submission)
          }, function(err) {
            return callback && callback(err)
          })
        },

        getList: function(type, last, callback) {
          API.getList({type: type, from: last}).then(function(data) {
            return callback(null, data.contests)
          })
        },
      }
    })
