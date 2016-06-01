(function () {
  'use strict';

  angular
    .module('categories.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('categories', {
        abstract: true,
        url: '/categories',
        template: '<ui-view/>'
      })
      .state('categories.list', {
        url: '',
        templateUrl: 'modules/categories/client/views/list-categories.client.view.html',
        controller: 'CategoriesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Categories List'
        }
      })
      .state('categories.create', {
        url: '/create',
        templateUrl: 'modules/categories/client/views/form-crawler.client.view.html',
        controller: 'CategoriesController',
        controllerAs: 'vm',
        resolve: {
          crawlerResolve: newCategory
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Categories Create'
        }
      })
      .state('categories.edit', {
        url: '/:crawlerId/edit',
        templateUrl: 'modules/categories/client/views/form-crawler.client.view.html',
        controller: 'CategoriesController',
        controllerAs: 'vm',
        resolve: {
          crawlerResolve: getCategory
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Category {{ crawlerResolve.title }}'
        }
      })
      .state('categories.view', {
        url: '/:crawlerId',
        templateUrl: 'modules/categories/client/views/view-crawler.client.view.html',
        controller: 'CategoriesController',
        controllerAs: 'vm',
        resolve: {
          crawlerResolve: getCategory
        },
        data: {
          pageTitle: 'Category {{ crawlerResolve.title }}'
        }
      });
  }

  getCategory.$inject = ['$stateParams', 'CategoriesService'];

  function getCategory($stateParams, CategoriesService) {
    return CategoriesService.get({
      crawlerId: $stateParams.crawlerId
    }).$promise;
  }

  newCategory.$inject = ['CategoriesService'];

  function newCategory(CategoriesService) {
    return new CategoriesService();
  }
}());
