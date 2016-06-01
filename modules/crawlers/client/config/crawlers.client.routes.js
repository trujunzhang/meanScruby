(function () {
  'use strict';

  angular
    .module('crawlers.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('crawlers', {
        abstract: true,
        url: '/crawlers',
        template: '<ui-view/>'
      })
      .state('crawlers.list', {
        url: '',
        templateUrl: 'modules/crawlers/client/views/list-crawlers.client.view.html',
        controller: 'CrawlersListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Crawlers List'
        }
      })
      .state('crawlers.create', {
        url: '/create',
        templateUrl: 'modules/crawlers/client/views/form-crawler.client.view.html',
        controller: 'CrawlersController',
        controllerAs: 'vm',
        resolve: {
          crawlerResolve: newCrawler
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Crawlers Create'
        }
      })
      .state('crawlers.edit', {
        url: '/:crawlerId/edit',
        templateUrl: 'modules/crawlers/client/views/form-crawler.client.view.html',
        controller: 'CrawlersController',
        controllerAs: 'vm',
        resolve: {
          crawlerResolve: getCrawler
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Crawler {{ crawlerResolve.title }}'
        }
      })
      .state('crawlers.view', {
        url: '/:crawlerId',
        templateUrl: 'modules/crawlers/client/views/view-crawler.client.view.html',
        controller: 'CrawlersController',
        controllerAs: 'vm',
        resolve: {
          crawlerResolve: getCrawler
        },
        data: {
          pageTitle: 'Crawler {{ crawlerResolve.title }}'
        }
      });
  }

  getCrawler.$inject = ['$stateParams', 'CrawlersService'];

  function getCrawler($stateParams, CrawlersService) {
    return CrawlersService.get({
      crawlerId: $stateParams.crawlerId
    }).$promise;
  }

  newCrawler.$inject = ['CrawlersService'];

  function newCrawler(CrawlersService) {
    return new CrawlersService();
  }
}());
