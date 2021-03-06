(function () {
    'use strict';

    angular
        .module('itunes')
        .controller('ItunesListController', ItunesListController);

    ItunesListController.$inject = ['ItunesService', '$stateParams', '$http'];

    function ItunesListController(ItunesService, $stateParams, $http) {
        var vm = this;

        vm.totalItems = 0;
        vm.currentPage = 1;

        vm.setPage = function (pageNo) {
            vm.currentPage = pageNo;
        };

        vm.pageChanged = function () {
            vm.getItunes();
        };

        vm.getItunes = function () {
            $http.get('api/itunesList/' + vm.currentPage).success(function (response) {
                vm.itunes = response;
            }).error(function (response) {
                vm.error = response.message;
            });
        };

        getTotalItems();

        function getTotalItems() {
            $http.get('api/totalItems/').success(function (response) {
                vm.totalItems = response;
            }).error(function (response) {
                vm.error = response.message;
            });
        }

    }
}());
