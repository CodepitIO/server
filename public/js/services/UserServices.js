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
        if (user && user.local.verified != null) {
          $cookies.put('user', JSON.stringify(user), {
            expires: new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
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
      $scope.isNotVerified = function() {
        return $scope.user.local && $scope.user.local.verified === false
      }

      $scope.isUser = function(usr) {
        var id = usr._id ? usr._id : usr
        return id === $scope.getId()
      }
      $scope.isInArray = function(array) {
        return _.some(array, $scope.isUser)
      }

      try {
        var user = JSON.parse($cookies.get('user'))
        $scope.set(user)
      } catch (err) {
        $scope.reset()
      }

      function checkUserStatus() {
        Request.send('get', $resource('/api/v1/user/status'))({}).then(function(data) {
          var curId = $scope.user && $scope.user._id || null
          var newId = data.user && data.user._id || null
          if (curId !== newId) $scope.set(data.user)
        })
      }
      $interval(checkUserStatus, 30 * 1000, 0, false)
      checkUserStatus()
    })
