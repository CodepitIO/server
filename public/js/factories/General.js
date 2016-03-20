var app = angular.module('General')
	.factory('RequestAPI', [
		'$q',
		'Notification',
		function($q, Notification) {
			var resolveOrReject = function(deferred, result) {
				if (result.error) {
					Notification.error(result.error);
					deferred.reject(result.error);
				} else {
					deferred.resolve(result);
				}
			}

			var reject = function(deferred, result) {
				Notification.error(result.statusText);
				deferred.reject(result.statusText);
			}

			return {
				post: function(API, params) {
					var deferred = $q.defer();
					API.save(
						params,
						resolveOrReject.bind(null, deferred),
						reject.bind(null, deferred)
					);
					return deferred.promise;
				},
				get: function(API, params) {
					var deferred = $q.defer();
					API.get(
						params,
						resolveOrReject.bind(null, deferred),
						reject.bind(null, deferred)
					);
					return deferred.promise;
				}
			};
		}
	])
	.factory('TimeFactory', [
		'$interval',
		'$resource',
		'RequestAPI',
		function($interval, $resource, global) {
			var diff = 0,
				now;
			var server = {
				dynamic: new Date(),
				static: new Date()
			};

			$interval(function() {
				now = (new Date()).getTime();
				server.dynamic = new Date(now + diff);
			}, 5000);

			var GetServerTimeAPI = $resource('/api/server/time', {});
			global.get(GetServerTimeAPI, {}).then(function(data) {
				var serverDate = new Date(data.date);
				var clientDate = new Date();

				diff = Math.max(0, serverDate - clientDate);
				now = (new Date()).getTime();
				server.dynamic = server.static = new Date(now + diff);
			});

			return {
				server: server
			};
		}
	])
	.factory('GeneralFunctions', [
		function() {
			return {
				getMinutesBetweenDates: function(startDate, endDate) {
					return Math.floor(((new Date(endDate)) - (new Date(startDate))) / 60000);
				},

				getSecondsBetweenDates: function(startDate, endDate) {
					return Math.floor(((new Date(endDate)) - (new Date(startDate))) / 1000);
				}
			};
		}
	]);
