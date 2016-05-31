(function () {
    'use strict';

    angular
        .module('itunes')
        .controller('ItunesListController', ItunesListController);

    ItunesListController.$inject = ['ItunesService', '$stateParams', '$http'];

    function ItunesListController(ItunesService, $stateParams, $http) {
        var vm = this;

        // vm.page = $stateParams.page;
        // vm.name = $stateParams.name;
        // vm.itunes = ItunesService.query();

        vm.totalItems = 150;
        vm.currentPage = 1;
        vm.pageSize = 10;

        vm.setPage = function (pageNo) {
            vm.currentPage = pageNo;
        };

        vm.pageChanged = function () {
            vm.getMembers();
        };

        vm.getItunes = function () {

            $http.get('api/itunesList/' + vm.currentPage).success(function (response) {
                vm.itunes = response;

            }).error(function (response) {
                vm.error = response.message;
            });
        };

    }
}());
