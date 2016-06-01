(function () {
    'use strict';

    angular
        .module('categories')
        .controller('CategoriesListController', CategoriesListController);

    CategoriesListController.$inject = ['CategoriesService', '$stateParams', '$http'];

    function CategoriesListController(CategoriesService, $stateParams, $http) {
        var vm = this;

        vm.totalItems = 0;
        vm.currentPage = 1;

        vm.setPage = function (pageNo) {
            vm.currentPage = pageNo;
        };

        vm.pageChanged = function () {
            vm.getCategories();
        };

        vm.getCategories = function () {
            $http.get('api/categoriesList/' + vm.currentPage).success(function (response) {
                vm.categories = response;
            }).error(function (response) {
                vm.error = response.message;
            });
        };

        getTotalItems();

        function getTotalItems() {
            $http.get('api/categoriesCount').success(function (response) {
                vm.totalItems = response;
            }).error(function (response) {
                vm.error = response.message;
            });
        }
    }
}());
