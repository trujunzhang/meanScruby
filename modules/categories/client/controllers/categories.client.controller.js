(function () {
  'use strict';

  angular
    .module('categories')
    .controller('CategoriesController', CategoriesController);

  CategoriesController.$inject = ['$scope', '$state', 'crawlerResolve', '$window', 'Authentication'];

  function CategoriesController($scope, $state, crawler, $window, Authentication) {
    var vm = this;

    vm.crawler = crawler;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Category
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.crawler.$remove($state.go('categories.list'));
      }
    }

    // Save Category
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.crawlerForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.crawler._id) {
        vm.crawler.$update(successCallback, errorCallback);
      } else {
        vm.crawler.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('categories.view', {
          crawlerId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
