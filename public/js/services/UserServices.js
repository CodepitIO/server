angular.module('User')
  .service('UserState', function ($cookies, $interval, $resource, Request) {
      var $scope = this
      $scope.user = {}

      $scope.reset = function () {
        $scope.user = {}
        $cookies.remove('user')
      }
      $scope.set = function(user) {
        $scope.user = user || {}
        if (user) {
          $cookies.put('user', JSON.stringify(user), {
            expires: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000)
          })
        } else {
          $cookies.remove('user')
        }
      }

      $scope.isAuthenticated = function() {
        return !!$scope.user._id
      }

      $scope.isAdmin = function() {
        return $scope.isAuthenticated() && $scope.user.access >= 10
      }

      $scope.getId = function() {
        return $scope.user._id || null
      }
      $scope.getUsername = function() {
        return $scope.user.local && $scope.user.local.username || null
      }
      $scope.getEmailHash = function() {
        return $scope.user.local && $scope.user.local.emailHash || null
      }
      $scope.isVerified = function() {
        return $scope.user.local && $scope.user.local.verified
      }

      $scope.isUser = function(usr) {
        var id = usr._id ? usr._id : usr
        return id === $scope.getId()
      }
      $scope.isInArray = function(array) {
        return _.some(array, $scope.isUser)
      }

      try {
        $scope.set(JSON.parse($cookies.get('user')))
      } catch (err) {
        $scope.reset()
      }

      $interval(function() {
        Request.send('get', $resource('/api/v1/user/status'))({}).then(function(data) {
          var curId = $scope.user && $scope.user._id || null
          var newId = data.user && data.user._id || null
          if (curId !== newId) $scope.set(data.user)
        })
      }, 30 * 1000, 0, false)
    })
