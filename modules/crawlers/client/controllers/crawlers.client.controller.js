(function () {
  'use strict';

  angular
    .module('crawlers')
    .controller('CrawlersController', CrawlersController);

  CrawlersController.$inject = ['$scope', '$state', 'crawlerResolve', '$window', 'Authentication'];

  function CrawlersController($scope, $state, crawler, $window, Authentication) {
    var vm = this;

    vm.crawler = crawler;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Crawler
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.crawler.$remove($state.go('crawlers.list'));
      }
    }

    // Save Crawler
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
        $state.go('crawlers.view', {
          crawlerId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
