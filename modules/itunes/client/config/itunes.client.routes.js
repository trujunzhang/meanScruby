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
            .state('itunes.pagination', {
                url: '/itunes/:page/:name',
                templateUrl: 'modules/itunes/client/views/list-itunes.client.view.html',
                controller: 'ItunesListController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'Itunes List'
                }
            })
            .state('itunes.List', {
                url: '/:page',
                templateUrl: 'modules/itunes/client/views/list-itunes.client.view.html',
                controller: 'ItunesListController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'Itunes List'
                },
                // default uri params
                params: {
                    page: 1
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
