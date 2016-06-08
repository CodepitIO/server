angular.module('User')
  .factory('UserAPI', [
    '$resource',
    'RequestAPI',
    function ($resource, request) {
      var RegisterAPI = $resource('/api/v1/user/register')
      var EditAPI = $resource('/api/v1/user/edit')
      var LoginAPI = $resource('/api/v1/user/login')
      var LogoutAPI = $resource('/api/v1/user/logout')
      var CheckUsernameAPI = $resource('/api/v1/user/check/username/:username')
      var CheckEmailAPI = $resource('/api/v1/user/check/email/:email')
      return {
        register: request.send('save', RegisterAPI),
        edit: request.send('save', EditAPI),
        login: request.send('save', LoginAPI),
        logout: request.send('get', LogoutAPI),
        checkUsername: request.send('get', CheckUsernameAPI),
        checkEmail: request.send('get', CheckEmailAPI)
      }
    }
  ])
  .factory('UserFacade', [
    '$rootScope',
    '$cookies',
    '$state',
    'Notification',
    'UserAPI',
    function ($rootScope, $cookies, $state, Notification, userAPI) {
      return {
        login: function (user, callback) {
          $rootScope.user = null
          $cookies.remove('user')
          userAPI.login(user).then(function (data) {
            if (data._id) {
              $rootScope.user = data
              $cookies.put('user', JSON.stringify(data), {
                expires: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000)
              })
              $state.go('profile.data', {id: data._id})
              Notification.success('Bem-vindo, ' + data.local.name + '!')
            }
            return callback && callback()
          })
        },

        logout: function (callback) {
          $cookies.remove('user')
          $rootScope.user = null
          $state.go('home')
          userAPI.logout().then(callback)
        },

        register: function (user, callback) {
          userAPI.register(user).then(function (data) {
            if (data._id) {
              $rootScope.user = data
              $state.go('profile.data', {id: data._id})
              Notification.success('Bem-vindo, ' + data.local.name + '.')
            }
            return callback && callback()
          }, function(err) {
            return callback && callback(err)
          })
        },

        edit: function (user, callback) {
          userAPI.edit(user).then(function (data) {
            Notification.info('Dados atualizados!')
            return callback && callback(null, true)
          })
        },

        checkUsername: function(username, callback) {
          userAPI.checkUsername({username: username}).then(function(data) {
            return callback && callback(null, data.available)
          })
        },

        checkEmail: function(email, callback) {
          userAPI.checkEmail({email: email}).then(function(data) {
            return callback && callback(null, data.available)
          })
        }
      }
    }
  ])
