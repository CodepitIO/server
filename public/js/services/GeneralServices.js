var app = angular.module('GeneralServices', [])
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
	.factory('TimeFactory', [
		'$interval',
		'$resource',
		'GlobalFactory',
		function($interval, $resource, global) {
			var diff = 0,
				now;
			var server = {
				time: new Date()
			};

			$interval(function() {
				now = (new Date()).getTime();
				server.time = new Date(now + diff);
			}, 5000);

			var GetServerTimeAPI = $resource('/api/server/time', {});
			global.get(GetServerTimeAPI, {}).then(function(data) {
				var serverDate = new Date(data.date);
				var clientDate = new Date();

				diff = Math.max(0, serverDate - clientDate);
				now = (new Date()).getTime();
				server.time = new Date(now + diff);
			});

			return {
				server: server
			};
		}
	]);
