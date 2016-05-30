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
        controller: 'ItunesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Itunes List'
        }
      })
      .state('itunes.create', {
        url: '/create',
        templateUrl: 'modules/itunes/client/views/form-itune.client.view.html',
        controller: 'ItunesController',
        controllerAs: 'vm',
        resolve: {
          ituneResolve: newItune
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Itunes Create'
        }
      })
      .state('itunes.edit', {
        url: '/:ituneId/edit',
        templateUrl: 'modules/itunes/client/views/form-itune.client.view.html',
        controller: 'ItunesController',
        controllerAs: 'vm',
        resolve: {
          ituneResolve: getItune
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Itune {{ ituneResolve.title }}'
        }
      })
      .state('itunes.view', {
        url: '/:ituneId',
        templateUrl: 'modules/itunes/client/views/view-itune.client.view.html',
        controller: 'ItunesController',
        controllerAs: 'vm',
        resolve: {
          ituneResolve: getItune
        },
        data: {
          pageTitle: 'Itune {{ ituneResolve.title }}'
        }
      });
  }

  getItune.$inject = ['$stateParams', 'ItunesService'];

  function getItune($stateParams, ItunesService) {
    return ItunesService.get({
      ituneId: $stateParams.ituneId
    }).$promise;
  }

  newItune.$inject = ['ItunesService'];

  function newItune(ItunesService) {
    return new ItunesService();
  }
}());
