angular.module('Submission')
  .factory('SubmissionAPI', [
    '$q',
    '$resource',
    'RequestAPI',
    function ($q, $resource, request) {
      var GetAPI = $resource('/api/v1/submission/:id', {})
      return {
        get: request.send('get', GetAPI)
      }
    }
  ])
