angular.module('Contests')
	.factory('ContestsFactory', [
		'$resource',
		'RequestAPI',
		function($resource, global) {
			var CreateAPI = $resource('/api/contests/create', {
				name: '@name',
				descr: '@descr',
				startDateTime: '@startDateTime',
				endDateTime: '@endDateTime',
				frozenDateTime: '@frozenDateTime',
				blindDateTime: '@blindDateTime',
				contestantType: '@contestantType',
				password: '@password',
				confirmPassword: '@confirmPassword',
				problems: '@problems',
			});
			var GetAllFromLoggedUserAPI = $resource('/api/contests/get/owner', {});
			var GetByFilterAPI = $resource('/api/contests/get/filter/:filter', {
				filter: '@filter'
			});
			return {
				create: global.post.bind(null, CreateAPI),
				getAllFromLoggedUser: global.get.bind(null, GetAllFromLoggedUserAPI),
				getByFilter: global.get.bind(null, GetByFilterAPI),
			};
		}
	]);
