angular.module('User')
  .factory('UserAPI', [
    '$resource',
    'RequestAPI',
    function ($resource, request) {
      var RegisterAPI = $resource('/api/v1/user/register', {
        name: '@name',
        surname: '@surname',
        email: '@email',
        password: '@password',
        confirmPassword: '@confirmPassword',
        username: '@username'
      })
      var EditAPI = $resource('/api/v1/user/edit', {
        name: '@name',
        surname: '@surname',
        email: '@email',
        password: '@password',
        newPassword: '@newPassword',
        confirmNewPassword: '@confirmNewPassword',
        username: '@username'
      })
      var LoginAPI = $resource('/api/v1/user/login', {
        email: '@email',
        password: '@password'
      })
      var LogoutAPI = $resource('/api/v1/user/logout', {})
      return {
        register: request.send('save', RegisterAPI),
        edit: request.send('save', EditAPI),
        login: request.send('save', LoginAPI),
        logout: request.send('get', LogoutAPI)
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
          $rootScope.emailHash = ''
          $cookies.remove('user')
          userAPI.login(user).then(function (data) {
            if (data._id) {
              $rootScope.user = data
              $rootScope.emailHash = data.local.emailHash
              $cookies.put('user', JSON.stringify(data), {
                expires: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000)
              })
              $state.go('profile')
              Notification.success('Bem-vindo, ' + data.local.name + '!')
              if (callback) return callback(null, true)
            }
            if (callback) return callback()
          })
        },

        logout: function (callback) {
          $cookies.remove('user')
          $rootScope.user = null
          $rootScope.emailHash = ''
          $state.go('home')
          userAPI.logout().then(callback)
        },

        register: function (user, callback) {
          userAPI.register(user).then(function (data) {
            if (data._id) {
              $rootScope.user = data
              $rootScope.emailHash = data.local.emailHash
              $state.go('profile')
              Notification.success('Bem-vindo, ' + data.local.name + '.')
            }
            if (callback) return callback()
          })
        },

        edit: function (user, callback) {
          userAPI.edit(user).then(function (data) {
            Notification.info('Dados atualizados!')
            if (callback) return callback(null, true)
          })
        }
      }
    }
  ])
  .service('UserSharedState', [
    '$rootScope',
    '$stateParams',
    'Notification',
    'UserFacade',
    'BlogFacade',
    function ($rootScope, $stateParams, Notification, user, blog) {
      var $scope = this

      $scope.reset = function () {
        $scope.id = $scope.emailHash = ''
        if ($rootScope.user) {
          $scope.id = $rootScope.user._id
          $scope.emailHash = $rootScope.user.local.emailHash
        }
      }
    }
  ])
