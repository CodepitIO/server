angular.module('Problems')
  .factory('ProblemsAPI', [
   '$resource',
   'Request',
    function ($resource, Request) {
      var API = {
        filter: Request.send('post', $resource('/api/v1/problems/filter')),
        get: Request.send('get', $resource('/api/v1/problems/:id'))
      }
      return {
        get: function (id, callback) {
          API.get({
            id: id
          }).then(function (data) {
            return callback(null, data)
          })
        },
        filter: function (text, problems, callback) {
          return API.filter({
            text: text,
            problems: problems
          })
        }
      }
    }
  ])
