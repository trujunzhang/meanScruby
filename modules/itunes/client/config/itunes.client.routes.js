(function () {
  'use strict';

  angular
    .module('itunes.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('itunes', {
        abstract: true,
        url: '/itunes',
        template: '<ui-view/>'
      })
      .state('itunes.list', {
        url: '',
        templateUrl: 'modules/itunes/client/views/list-itunes.client.view.html',
        controller: 'ArticlesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Articles List'
        }
      })
      .state('itunes.create', {
        url: '/create',
        templateUrl: 'modules/itunes/client/views/form-itune.client.view.html',
        controller: 'ArticlesController',
        controllerAs: 'vm',
        resolve: {
          ituneResolve: newArticle
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Articles Create'
        }
      })
      .state('itunes.edit', {
        url: '/:ituneId/edit',
        templateUrl: 'modules/itunes/client/views/form-itune.client.view.html',
        controller: 'ArticlesController',
        controllerAs: 'vm',
        resolve: {
          ituneResolve: getArticle
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Article {{ ituneResolve.title }}'
        }
      })
      .state('itunes.view', {
        url: '/:ituneId',
        templateUrl: 'modules/itunes/client/views/view-itune.client.view.html',
        controller: 'ArticlesController',
        controllerAs: 'vm',
        resolve: {
          ituneResolve: getArticle
        },
        data: {
          pageTitle: 'Article {{ ituneResolve.title }}'
        }
      });
  }

  getArticle.$inject = ['$stateParams', 'ArticlesService'];

  function getArticle($stateParams, ArticlesService) {
    return ArticlesService.get({
      ituneId: $stateParams.ituneId
    }).$promise;
  }

  newArticle.$inject = ['ArticlesService'];

  function newArticle(ArticlesService) {
    return new ArticlesService();
  }
}());
