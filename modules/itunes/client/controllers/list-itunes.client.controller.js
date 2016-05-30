(function () {
    'use strict';

    angular
        .module('itunes')
        .controller('ItunesListController', ItunesListController);

    ItunesListController.$inject = ['ItunesService', '$stateParams'];

    function ItunesListController(ItunesService, $stateParams) {
        var vm = this;

        vm.page = $stateParams.page;
        vm.name = $stateParams.name;
        vm.itunes = ItunesService.query();

    }
}());
