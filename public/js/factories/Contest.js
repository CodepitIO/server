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
        getList: request.send('get', $resource('/api/v1/contest/list/:type/last/:last'), {ignoreThrottle: true})
      }
    }
  ])
  .factory('ContestFacade', [
    'Notification',
    'ContestAPI',
    function (Notification, contestAPI) {
      return {
        getList: function(type, last, callback) {
          contestAPI.getList({type: type, last: last}).then(function(data) {
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

        // Join a contest
        join: function (contest, data, callback) {
          if (contest.isPrivate && data.password.length === 0) {
            return Notification.error('Você deve inserir uma senha.')
          }
          if (data.role === '') {
            return Notification.error('Você deve informar se deseja participar em time ou individualmente.')
          }
          if (data.role === 'team' && typeof (data.team) !== 'string') {
            return Notification.error('Você deve informar um time.')
          }
          if (data.role !== 'team' || typeof (data.team) !== 'string') {
            data.team = '0'
          }
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

        // Remove a contest
        remove: function (id, callback) {
          contestAPI.remove({
            id: id
          })
            .then(function (data) {
              Notification('Competição removida.')
              callback(null, true)
            }, function (err) {
              callback(err)
            })
        }
      }
    }
  ])
