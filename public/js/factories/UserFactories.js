angular.module('User')
  .factory('UserAPI', function ($state, $resource, Request, Notification, UserState) {
      var API = {
        register: Request.send('post', $resource('/api/v1/user/register')),
        edit: Request.send('post', $resource('/api/v1/user/edit')),
        login: Request.send('post', $resource('/api/v1/user/login')),
        logout: Request.send('get', $resource('/api/v1/user/logout')),
        checkUsername: Request.send('get', $resource('/api/v1/user/check/username/:username')),
        checkEmail: Request.send('get', $resource('/api/v1/user/check/email/:email')),
        teams: Request.send('get', $resource('/api/v1/user/teams')),
        recover: Request.send('post', $resource('api/v1/user/recover')),
        sendPasswordRecoveryEmail: Request.send('get', $resource('/api/v1/user/recover/:user')),
        sendValidationEmail: Request.send('get', $resource('/api/v1/user/validate')),
        validate: Request.send('get', $resource('/api/v1/user/validate/:hash')),
        get: Request.send('get', $resource('/api/v1/user/:id')),
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
          }, function() {
            return callback && callback()
          })
        },

        logout: function (callback) {
          UserState.reset()
          $state.go('home')
          API.logout().then(callback)
        },

        recover: function(user, callback) {
          API.recover(user).then(function(data) {
            UserState.set(data)
            $state.go('profile', {id: data._id})
            Notification.success('Bem-vindo, ' + data.local.name + '!')
          })
        },

        sendPasswordRecoveryEmail: function(user, callback) {
          API.sendPasswordRecoveryEmail({user: user}).then(function() {
            Notification.info('E-mail de recuperação de senha enviado.')
          })
        },

        sendValidationEmail: function(callback) {
          API.sendValidationEmail().then(function() {
            Notification.info('E-mail de verificação enviado.')
          })
        },

        validate: function (hash, callback) {
          API.validate({hash: hash}).then(function(data) {
            UserState.set(data)
            $state.go('profile', {id: data._id})
            Notification.success('E-mail validado!')
          }, function() {
            $state.go('home')
          })
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
    })
