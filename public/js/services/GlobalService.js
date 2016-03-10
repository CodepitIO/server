var app = angular.module('GlobalService', [])
	.factory('GlobalFactory', [
		'$q',
		function($q) {
			return {
				post: function(API, params) {
					var deferred = $q.defer();
					API.save(params, function(result) {
						if (result.error) {
							deferred.reject(result.error);
						} else {
							deferred.resolve(result);
						}
					});
					return deferred.promise;
				},
				get: function(API, params) {
					var deferred = $q.defer();
					API.get(params, function(result) {
						if (result.error) {
							deferred.reject(result.error);
						} else {
							deferred.resolve(result);
						}
					});
					return deferred.promise;
				}
			};
		}
	])
	.value('GlobalFlags', {
		'createContest': 1
	});
