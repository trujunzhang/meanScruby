(function () {
  'use strict';

  angular
    .module('crawlers')
    .controller('CrawlersListController', CrawlersListController);

  CrawlersListController.$inject = ['CrawlersService'];

  function CrawlersListController(CrawlersService) {
    var vm = this;

    vm.crawlers = CrawlersService.query();
  }
}());
