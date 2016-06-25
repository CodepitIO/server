angular.module('Team')
  .factory('TeamAPI', [
    '$resource',
    'Request',
    function ($resource, Request) {
      var API = {
        create: Request.send('save', $resource('/api/v1/team/create')),
        edit: Request.send('save', $resource('/api/v1/team/:id/edit', { id: '@id' })),
        leave: Request.send('save', $resource('/api/v1/team/:id/leave', { id: '@id' })),
        invite: Request.send('save', $resource('/api/v1/team/:id/invite', { id: '@id' })),
        remove: Request.send('save', $resource('/api/v1/team/:id/remove', { id: '@id' })),
        accept: Request.send('save', $resource('/api/v1/team/:id/accept', { id: '@id' })),
        decline: Request.send('save', $resource('/api/v1/team/:id/decline', { id: '@id' })),
        getByLoggedUser: Request.send('get', $resource('/api/v1/team/user')),
        get: Request.send('get', $resource('/api/v1/team/:id')),
      }
      return {
        create: function(team, callback) {
          API.create(team).then(function(data) {
            return callback(null, data.team)
          })
        },
        edit: function(team, callback) {
          API.edit(team).then(function(data) {
            return callback()
          })
        },
        leave: function(teamId, callback) {
          API.leave({id: teamId}).then(function(data) {
            return callback()
          })
        },
        invite: function(teamId, invitedEmail, callback) {
          API.invite({id: teamId, invited: invitedEmail}).then(function(data) {
            return callback(null, data.invited)
          })
        },
        remove: function(teamId, removedId, callback) {
          API.remove({id: teamId, removed: removedId}).then(function(data) {
            return callback()
          })
        },
        accept: function(teamId, callback) {
          API.accept({id: teamId}).then(function(data) {
            return callback()
          })
        },
        decline: function(teamId, callback) {
          API.decline({id: teamId}).then(function(data) {
            return callback()
          })
        },
        getByLoggedUser: function(callback) {
          API.getByLoggedUser().then(function(data) {
            return callback(null, {member: data.member, invited: data.invited})
          })
        },
        getById: function(teamId, callback) {
          API.getById({id: teamId}).then(function(data) {
            return callback(null, data.team)
          })
        }
      }
    }
  ])
