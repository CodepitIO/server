angular.module('Problems')
  .factory('ProblemsAPI', [
    '$http',
    '$resource',
    '$q',
    'RequestAPI',
    function ($http, $resource, $q, request) {
      return {
        filter: request.send('post', $resource('/api/v1/problems/filter')),
        get: request.send('get', $resource('/api/v1/problems/:id'))
      }
    }
  ])
  .factory('ProblemsFacade', [
    'ProblemsAPI',
    function (ProblemsAPI) {
      return {
        get: function (id, callback) {
          ProblemsAPI.get({
            id: id
          }).then(function (data) {
            return callback(null, data)
          })
        },
        filter: function (text, callback) {
          return ProblemsAPI.filter({
            text: text
          })
        }
      }
    }
  ])
