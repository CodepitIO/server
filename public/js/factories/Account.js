angular.module('Account')
  .factory('AccountAPI', [
    '$resource',
    'RequestAPI',
    function ($resource, request) {
      var RegisterAPI = $resource('/api/v1/account/register', {
        name: '@name',
        surname: '@surname',
        email: '@email',
        password: '@password',
        confirmPassword: '@confirmPassword',
        username: '@username'
      })
      var EditAPI = $resource('/api/v1/account/edit', {
        name: '@name',
        surname: '@surname',
        email: '@email',
        password: '@password',
        newPassword: '@newPassword',
        confirmNewPassword: '@confirmNewPassword',
        username: '@username'
      })
      var LoginAPI = $resource('/api/v1/account/login', {
        email: '@email',
        password: '@password'
      })
      var LogoutAPI = $resource('/api/v1/account/logout', {})
      return {
        register: request.send('save', RegisterAPI),
        edit: request.send('save', EditAPI),
        login: request.send('save', LoginAPI),
        logout: request.send('get', LogoutAPI)
      }
    }
  ])
  .factory('AccountFacade', [
    '$rootScope',
    '$cookies',
    '$state',
    'Notification',
    'AccountAPI',
    function ($rootScope, $cookies, $state, Notification, accountAPI) {
      return {
        login: function (account, callback) {
          $rootScope.user = null
          $rootScope.emailHash = ''
          $cookies.remove('user')
          accountAPI.login(account).then(function (data) {
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
          accountAPI.logout().then(callback)
        },

        register: function (account, callback) {
          accountAPI.register(account).then(function (data) {
            if (data._id) {
              $rootScope.user = data
              $rootScope.emailHash = data.local.emailHash
              $state.go('profile')
              Notification.success('Bem-vindo, ' + data.local.name + '.')
            }
            if (callback) return callback()
          })
        },

        edit: function (account, callback) {
          accountAPI.edit(account).then(function (data) {
            Notification.info('Dados atualizados!')
            if (callback) return callback(null, true)
          })
        }
      }
    }
  ])
  .service('AccountSharedState', [
    '$rootScope',
    '$stateParams',
    'Notification',
    'AccountFacade',
    'BlogFacade',
    function ($rootScope, $stateParams, Notification, account, blog) {
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
