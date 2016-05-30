(function () {
  'use strict';

  angular
    .module('itunes')
    .controller('ArticlesController', ArticlesController);

  ArticlesController.$inject = ['$scope', '$state', 'ituneResolve', '$window', 'Authentication'];

  function ArticlesController($scope, $state, itune, $window, Authentication) {
    var vm = this;

    vm.itune = itune;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Article
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.itune.$remove($state.go('itunes.list'));
      }
    }

    // Save Article
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.ituneForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.itune._id) {
        vm.itune.$update(successCallback, errorCallback);
      } else {
        vm.itune.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('itunes.view', {
          ituneId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
