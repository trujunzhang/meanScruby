(function () {
    'use strict';

    angular
        .module('itunes')
        .controller('ItunesListController', ItunesListController);

    ItunesListController.$inject = ['ItunesService', '$stateParams'];

    function ItunesListController(ItunesService, $stateParams) {
        var vm = this;

        // vm.page = $stateParams.page;
        // vm.name = $stateParams.name;
        // vm.itunes = ItunesService.query();

        vm.totalItems = 15;
        vm.currentPage = 1;

        vm.setPage = function (pageNo) {
            vm.currentPage = pageNo;
        };

        vm.pageChanged = function () {
            vm.getMembers();
        };        

        vm.getItunes = function () {

            $http.get('/articleList/' + vm.currentPage).success(function (response) {
                vm.articles = response;

            }).error(function (response) {
                vm.error = response.message;
            });
        };

    }
}());
