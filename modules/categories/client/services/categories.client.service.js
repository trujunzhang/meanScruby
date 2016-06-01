(function () {
  'use strict';

  angular
    .module('categories.services')
    .factory('CategoriesService', CategoriesService);

  CategoriesService.$inject = ['$resource'];

  function CategoriesService($resource) {
    return $resource('api/categories/:crawlerId', {
      crawlerId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
