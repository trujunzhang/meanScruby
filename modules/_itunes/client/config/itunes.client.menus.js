(function () {
  'use strict';

  angular
    .module('itunes')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Itunes',
      state: 'itunes',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'itunes', {
      title: 'List Itunes',
      state: 'itunes.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'itunes', {
      title: 'Create Itune',
      state: 'itunes.create',
      roles: ['user']
    });
  }
}());
