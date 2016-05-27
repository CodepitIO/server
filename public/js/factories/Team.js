angular.module('Team')
  .factory('TeamAPI', [
    '$http',
    '$q',
    '$resource',
    'RequestAPI',
    function ($http, $q, $resource, request) {
      var CreateTeamAPI = $resource('/api/v1/team/create', {
        name: '@name'
      })
      var GetUserTeamsAPI = $resource('/api/v1/team/user/:id', {
        id: '@id'
      })
      var LeaveTeamAPI = $resource('/api/v1/team/leave', {
        id: '@id'
      })
      var GetTeamAPI = $resource('/api/v1/team/get/:id', {
        id: '@id'
      })
      var InviteAPI = $resource('/api/v1/team/invite', {
        id: '@id',
        invitee: '@invitee'
      })
      var RemoveFromTeamAPI = $resource('/api/v1/team/remove', {
        id: '@id',
        removee: '@removee'
      })
      var AcceptInviteAPI = $resource('/api/v1/team/accept/:id', {
        id: '@id'
      })
      var DeclineInviteAPI = $resource('/api/v1/team/decline/:id', {
        id: '@id'
      })
      var EditAPI = $resource('/api/v1/team/edit', {
        id: '@id',
        name: '@name',
        descr: '@descr'
      })
      return {
        create: request.send('save', CreateTeamAPI),
        getFromUser: request.send('get', GetUserTeamsAPI),
        leave: request.send('save', LeaveTeamAPI),
        get: request.send('get', GetTeamAPI),
        invite: request.send('save', InviteAPI),
        remove: request.send('save', RemoveFromTeamAPI),
        accept: request.send('get', AcceptInviteAPI),
        decline: request.send('get', DeclineInviteAPI),
        edit: request.send('save', EditAPI)
      }
    }
  ])
  .factory('TeamFacade', [
    'TeamAPI',
    function (teamAPI) {
      return {
        leave: function (id, callback) {
          teamAPI.leave({
            id: id
          }).then(callback)
        }

      }
    }
  ])
