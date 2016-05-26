angular.module('Blog')
	.factory('BlogAPI', [
		'$resource',
		'RequestAPI',
		function($resource, request) {
			var PostAPI = $resource('/api/v1/blog/post', {
				title: '@title',
				body: '@body',
			});
			var GetByFilterAPI = $resource('/api/v1/blog/filter', {
				filter: '@filter',
				page: '@page'
			});
			var GetCountByFilterAPI = $resource('/api/v1/blog/count', {
				filter: '@filter'
			});
			return {
				post: request.send('save', PostAPI),
				getByFilter: request.send('save', GetByFilterAPI),
				getCountByFilter: request.send('save', GetCountByFilterAPI),
			};
		}
	])
	.factory('BlogFacade', [
		'$rootScope',
		'$cookies',
		'$state',
		'Notification',
		'BlogAPI',
		function($rootScope, $cookies, $state, Notification, blogAPI) {
			return {
				post: function(post, callback) {
					blogAPI.post(post).then(function(data) {

					});
				},

				getByFilter: function(filter, page, callback) {
					blogAPI.getByFilter({
						filter: filter,
						page: page
					}).then(function(data) {
						return callback(null, data.posts);
					});
				},

				getCountByFilter: function(filter, callback) {
					blogAPI.getCountByFilter({
						filter: filter
					}).then(function(data) {
						return callback(null, data.count);
					});
				}
			}
		}
	]);
