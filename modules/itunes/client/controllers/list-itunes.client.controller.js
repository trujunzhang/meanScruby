(function () {
  'use strict';

  angular
    .module('itunes')
    .controller('ArticlesListController', ArticlesListController);

  ArticlesListController.$inject = ['ArticlesService'];

  function ArticlesListController(ArticlesService) {
    var vm = this;

    vm.itunes = ArticlesService.query();
  }
}());
