angular.module('Contests')
  .factory('ContestAPI', [
    '$resource',
    'RequestAPI',
    function ($resource, request) {
      return {
        create: request.send('post', $resource('/api/v1/contest/')),
        remove: request.send('delete', $resource('/api/v1/contest/:id')),
        edit: request.send('put', $resource('/api/v1/contest/:id/edit')),
        join: request.send('put', $resource('/api/v1/contest/:id/join')),
        leave: request.send('put', $resource('/api/v1/contest/:id/leave')),
        getList: request.send('get', $resource('/api/v1/contest/list/:type/from/:from'), {ignoreThrottle: true}),

        getData: request.send('get', $resource('/api/v1/contest/:id/data')),
        getSubmissions: request.send('get', $resource('/api/v1/contest/:id/submissions/user')),
        submit: request.send('post', $resource('/api/v1/contest/:id/submit', { id: '@id' })),
        getVerdictByTimestamp: request.send('get', $resource('/api/v1/contest/:id/submission/timestamp/:timestamp')),
      }
    }
  ])
  .factory('ContestFacade', [
    'Notification',
    'Upload',
    'ContestAPI',
    function (Notification, Upload, contestAPI) {
      return {
        getList: function(type, last, callback) {
          contestAPI.getList({type: type, from: last}).then(function(data) {
            return callback(null, data.contests)
          })
        },

        leave: function (id, callback) {
          contestAPI.leave({
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
          contestAPI.join({
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
          contestAPI.remove({
            id: id
          }).then(function (data) {
            Notification('Competição removida.')
            callback && callback(null, true)
          }, function (err) {
            callback && callback(err)
          })
        },

        // Contest instance
        getContestData: function(id, callback) {
          contestAPI.getData({
            id: id
          }).then(function(data) {
            callback && callback(null, data)
          }, callback)
        },

        getSubmissions: function(id, callback) {
          contestAPI.getSubmissions({
            id: id
          }).then(function(data) {
            callback(null, data.submissions)
          }, callback)
        },

        submit: function (contestId, submission, callback) {
          var promise
          if (submission.codefile) {
            promise = Upload.upload({
              url: '/api/v1/contest/' + contestId + '/submitfile',
              data: {
                id: contestId,
                file: submission.codefile,
                problem: submission.problem,
                language: submission.language
              }
            })
          } else {
            promise = contestAPI.submit({
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

        getVerdictByTimestamp: function(contestId, timestamp, callback) {
          contestAPI.getVerdictByTimestamp({
            id: contestId,
            timestamp: timestamp.getTime()
          }).then(function(data) {
            return callback && callback(null, data.submission)
          }, callback)
        }
      }
    }
  ])
