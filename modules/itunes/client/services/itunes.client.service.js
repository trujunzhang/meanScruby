(function () {
  'use strict';

  angular
    .module('itunes.services')
    .factory('ArticlesService', ArticlesService);

  ArticlesService.$inject = ['$resource'];

  function ArticlesService($resource) {
    return $resource('api/itunes/:ituneId', {
      ituneId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
