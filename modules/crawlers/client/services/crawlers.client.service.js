(function () {
  'use strict';

  angular
    .module('crawlers.services')
    .factory('CrawlersService', CrawlersService);

  CrawlersService.$inject = ['$resource'];

  function CrawlersService($resource) {
    return $resource('api/crawlers/:crawlerId', {
      crawlerId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
