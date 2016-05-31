angular.module('Post')
  .factory('PostAPI', [
    '$resource',
    'RequestAPI',
    function ($resource, request) {
      var PostAPI = $resource('/api/v1/post/')
      var GetByUserAPI = $resource('/api/v1/post/user/get/:id')
      var GetCountByUserAPI = $resource('/api/v1/post/user/count/:id')
      var GetByPageAPI = $resource('/api/v1/post/page/get/:name')
      var GetCountByPageAPI = $resource('/api/v1/post/page/count/:name')
      return {
        post: request.send('save', PostAPI),
        getByUser: request.send('get', GetByUserAPI),
        getCountByUser: request.send('get', GetCountByUserAPI),
        getByPage: request.send('get', GetByPageAPI),
        getCountByPage: request.send('get', GetCountByPageAPI),
      }
    }
  ])
  .factory('PostFacade', [
    '$rootScope',
    '$cookies',
    '$state',
    'Notification',
    'PostAPI',
    function ($rootScope, $cookies, $state, Notification, postAPI) {
      return {
        post: function (post, callback) {
          postAPI.post(post).then(function (data) {})
        },

        get: function (user, page, callback) {
          var query;
          if (user) query = postAPI.getByUser({ id: user });
          else if (page) query = postAPI.getByPage({ name: page });
          else return callback()
          query.then(function (data) {
            return callback(null, data.posts)
          })
        },

        count: function (user, page, callback) {
          var query;
          if (user) query = postAPI.getCountByUser({ id: user });
          else if (page) query = postAPI.getCountByPage({ name: page });
          else return callback()
          query.then(function (data) {
            return callback(null, data.count)
          })
        }
      }
    }
  ])
