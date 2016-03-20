angular.module('Catalog').factory('CatalogFactory', [
	'$resource',
	'RequestAPI',
	function($resource, global) {
		var UpdateAPI = $resource('/api/catalog/update', {
			keys: '@keys',
			data: '@data'
		});
		var GetAPI = $resource('/api/catalog/get', {
			keys: '@keys',
			data: '@data'
		});
		return {
			update: global.post.bind(null, UpdateAPI),
			get: global.post.bind(null, GetAPI)
		};
	}
]);
