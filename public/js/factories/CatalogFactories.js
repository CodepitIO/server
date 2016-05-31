angular.module('Catalog').factory('CatalogFactory', [
  '$resource',
  'RequestAPI',
  function ($resource, request) {
    var UpdateAPI = $resource('/api/v1/catalog/update', {
      keys: '@keys',
      data: '@data'
    })
    var GetAPI = $resource('/api/v1/catalog/get', {
      keys: '@keys',
      data: '@data'
    })
    return {
      update: request.send('save', UpdateAPI),
      get: request.send('save', GetAPI)
    }
  }
])
