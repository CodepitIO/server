angular.module('Submission')
  .factory('SubmissionAPI', function ($q, $resource, Request) {
      return {
        get: Request.send('get', $resource('/api/v1/submission/:id'))
      }
    })
