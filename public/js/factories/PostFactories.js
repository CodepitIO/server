angular.module('Post')
  .factory('PostAPI', [
    '$rootScope',
    '$cookies',
    '$state',
    '$resource',
    'Request',
    'Notification',
    function ($rootScope, $cookies, $state, $resource, Request, Notification) {
      var API = {
        post: Request.send('save', $resource('/api/v1/post/')),
        getByUser: Request.send('get', $resource('/api/v1/post/user/get/:id')),
        getCountByUser: Request.send('get', $resource('/api/v1/post/user/count/:id')),
        getByPage: Request.send('get', $resource('/api/v1/post/page/get/:name')),
        getCountByPage: Request.send('get', $resource('/api/v1/post/page/count/:name')),
      }
      return {
        post: function (post, callback) {
          API.post(post).then(function (data) {})
        },

        get: function (user, page, callback) {
          var query;
          if (user) query = API.getByUser({ id: user });
          else if (page) query = API.getByPage({ name: page });
          else return callback()
          query.then(function (data) {
            return callback(null, data.posts)
          })
        },

        count: function (user, page, callback) {
          var query;
          if (user) query = API.getCountByUser({ id: user });
          else if (page) query = API.getCountByPage({ name: page });
          else return callback()
          query.then(function (data) {
            return callback(null, data.count)
          })
        }
      }
    }
  ])
