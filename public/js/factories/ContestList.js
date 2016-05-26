angular.module('Contests')
	.factory('ContestsFactory', [
		'$resource',
		'RequestAPI',
		function($resource, request) {
			var CreateAPI = $resource('/api/v1/contests/create', {
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
			var GetAllFromLoggedUserAPI = $resource('/api/v1/contests/get/owner', {});
			var GetByFilterAPI = $resource('/api/v1/contests/get/filter/:filter', {
				filter: '@filter',
				lastQueryDate: '@lastQueryDate',
			});
			return {
				create: request.send('save', CreateAPI),
				getAllFromLoggedUser: request.send('get', GetAllFromLoggedUserAPI),
				getByFilter: request.send('save', GetByFilterAPI),
			};
		}
	]);
