angular.module('Team').factory('TeamFactory', [
	'$http',
	'$q',
	'$resource',
	'GlobalFactory',
	function($http, $q, $resource, global) {
		var CreateTeamAPI = $resource('/api/team/create', {
			name: '@name'
		});
		var GetUserTeamsAPI = $resource('/api/team/user/:id', {
			id: '@id'
		});
		var LeaveTeamAPI = $resource('/api/team/leave', {
			id: '@id'
		});
		var GetTeamAPI = $resource('/api/team/get/:id', {
			id: '@id'
		});
		var InviteAPI = $resource('/api/team/invite', {
			id: '@id',
			invitee: '@invitee'
		});
		var RemoveFromTeamAPI = $resource('/api/team/remove', {
			id: '@id',
			removee: '@removee'
		});
		var AcceptInviteAPI = $resource('/api/team/accept/:id', {
			id: '@id',
		});
		var DeclineInviteAPI = $resource('/api/team/decline/:id', {
			id: '@id',
		});
		var EditAPI = $resource('/api/team/edit', {
			id: '@id',
			name: '@name',
			descr: '@descr'
		});
		return {
			create: global.post.bind(null, CreateTeamAPI),
			getFromUser: global.get.bind(null, GetUserTeamsAPI),
			leave: global.post.bind(null, LeaveTeamAPI),
			get: global.get.bind(null, GetTeamAPI),
			invite: global.post.bind(null, InviteAPI),
			remove: global.post.bind(null, RemoveFromTeamAPI),
			accept: global.get.bind(null, AcceptInviteAPI),
			decline: global.get.bind(null, DeclineInviteAPI),
			edit: global.post.bind(null, EditAPI)
		};
	}
]);
