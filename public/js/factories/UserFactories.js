angular.module('User')
  .factory('UserAPI', [
    '$state',
    '$resource',
    'Request',
    'Notification',
    'UserState',
    function ($state, $resource, Request, Notification, UserState) {
      var API = {
        register: Request.send('save', $resource('/api/v1/user/register')),
        edit: Request.send('save', $resource('/api/v1/user/edit')),
        login: Request.send('save', $resource('/api/v1/user/login')),
        logout: Request.send('get', $resource('/api/v1/user/logout')),
        checkUsername: Request.send('get', $resource('/api/v1/user/check/username/:username')),
        checkEmail: Request.send('get', $resource('/api/v1/user/check/email/:email')),
        teams: Request.send('get', $resource('/api/v1/user/teams')),
        get: Request.send('get', $resource('/api/v1/user/:id'))
      }
      return {
        login: function (user, callback) {
          UserState.reset()

          API.login(user).then(function (data) {
            if (data._id) {
              UserState.set(data)
              $state.go('profile', {id: data._id})
              Notification.success('Bem-vindo, ' + data.local.name + '!')
            }
            return callback && callback()
          })
        },

        logout: function (callback) {
          UserState.reset()
          $state.go('home')
          API.logout().then(callback)
        },

        register: function (user, callback) {
          API.register(user).then(function (data) {
            if (data._id) {
              UserState.set(data)
              $state.go('profile', {id: data._id})
              Notification.success('Bem-vindo, ' + data.local.name + '.')
            }
            return callback && callback()
          }, function(err) {
            return callback && callback(err)
          })
        },

        edit: function (user, callback) {
          API.edit(user).then(function (data) {
            Notification.info('Dados atualizados!')
            return callback && callback(null, true)
          })
        },

        teams: function(callback) {
          if (!UserState.isAuthenticated()) return
          API.teams().then(function(data) {
            return callback && callback(null, {member: data.member, invited: data.invited})
          })
        },

        get: function(userId, callback) {
          API.get({id: userId}).then(function(data) {
            return callback(data.user)
          })
        },

        checkUsername: function(username, callback) {
          API.checkUsername({username: username}).then(function(data) {
            return callback && callback(null, data.available)
          })
        },

        checkEmail: function(email, callback) {
          API.checkEmail({email: email}).then(function(data) {
            return callback && callback(null, data.available)
          })
        },
      }
    }
  ])
