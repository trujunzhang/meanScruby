(function () {
  'use strict';

  angular
    .module('itunes')
    .controller('ItunesListController', ItunesListController);

  ItunesListController.$inject = ['ItunesService'];

  function ItunesListController(ItunesService) {
    var vm = this;

    vm.itunes = ItunesService.query();
  }
}());
