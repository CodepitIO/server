angular.module('Submission')
  .factory('SubmissionAPI', function ($q, $resource, request) {
      return {
        get: request.send('get', $resource('/api/v1/submission/:id'))
      }
    })
