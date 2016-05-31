(function () {
  'use strict';

  angular
    .module('itunes.services')
    .factory('ItunesService', ItunesService);

  ItunesService.$inject = ['$resource'];

  function ItunesService($resource) {
    return $resource('api/itunes/:ituneId', {
      ituneId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
