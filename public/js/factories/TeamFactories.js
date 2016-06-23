angular.module('Team')
  .factory('TeamAPI', [
    '$resource',
    'Request',
    function ($resource, Request) {
      var API = {
        create: Request.send('save', $resource('/api/v1/team/create')),
        getFromUser: Request.send('get', $resource('/api/v1/team/user/:id')),
        leave: Request.send('save', $resource('/api/v1/team/leave')),
        get: Request.send('get', $resource('/api/v1/team/get/:id')),
        invite: Request.send('save', $resource('/api/v1/team/invite')),
        remove: Request.send('save', $resource('/api/v1/team/remove')),
        accept: Request.send('get', $resource('/api/v1/team/accept/:id')),
        decline: Request.send('get', $resource('/api/v1/team/decline/:id')),
        edit: Request.send('save', $resource('/api/v1/team/edit'))
      }
      return {
        leave: function (id, callback) {
          API.leave({
            id: id
          }).then(callback)
        }
      }
    }
  ])
