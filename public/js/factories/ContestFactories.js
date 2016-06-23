angular.module('Contests')
  .factory('ContestAPI', [
    '$resource',
    'Request',
    'Notification',
    'Upload',
    function ($resource, Request, Notification, Upload) {
      var API = {
        create: Request.send('post', $resource('/api/v1/contest/')),
        remove: Request.send('delete', $resource('/api/v1/contest/:id')),
        edit: Request.send('put', $resource('/api/v1/contest/:id/edit')),
        join: Request.send('put', $resource('/api/v1/contest/:id/join')),
        leave: Request.send('put', $resource('/api/v1/contest/:id/leave')),
        getList: Request.send('get', $resource('/api/v1/contest/list/:type/from/:from'), {ignoreThrottle: true}),

        getMetadata: Request.send('get', $resource('/api/v1/contest/:id/metadata')),
        getEvents: Request.send('get', $resource('/api/v1/contest/:id/events')),
        getSubmissions: Request.send('get', $resource('/api/v1/contest/:id/submissions/user')),
        submit: Request.send('post', $resource('/api/v1/contest/:id/submit', { id: '@id' })),
      }

      return {
        getList: function(type, last, callback) {
          API.getList({type: type, from: last}).then(function(data) {
            return callback(null, data.contests)
          })
        },

        leave: function (id, callback) {
          API.leave({
            id: id
          }).then(function (data) {
            Notification('Você saiu da competição.')
            callback(null, true)
          }, function (err) {
            Notification.error(err)
            callback(err)
          })
        },

        join: function (contest, data, callback) {
          API.join({
            id: contest._id,
            password: data.password,
            team: data.team
          }).then(function (data) {
            Notification.success('Inscrito com sucesso nessa competição!')
            callback(null, true)
          }, function (err) {
            Notification.error(err)
            callback(err)
          })
        },

        remove: function (id, callback) {
          API.remove({
            id: id
          }).then(function (data) {
            Notification('Competição removida.')
            callback && callback(null, true)
          }, function (err) {
            callback && callback(err)
          })
        },

        // Contest instance
        getContestMetadata: function(id, callback) {
          API.getMetadata({
            id: id
          }).then(function(data) {
            callback && callback(null, data)
          }, callback)
        },

        getContestEvents: function(id, callback) {
          API.getEvents({
            id: id
          }).then(function(data) {
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
          }, callback)
        },

        getSubmissions: function(id, callback) {
          API.getSubmissions({
            id: id
          }).then(function(data) {
            callback(null, data.submissions)
          }, callback)
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
          promise.then(
            function (data) {
              Notification('Código enviado!')
              return callback(null, data.submission || data.data.submission)
            },
            callback
          )
        },
      }
    }
  ])
