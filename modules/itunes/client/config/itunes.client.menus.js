(function () {
  'use strict';

  angular
    .module('itunes')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Articles',
      state: 'itunes',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'itunes', {
      title: 'List Articles',
      state: 'itunes.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'itunes', {
      title: 'Create Article',
      state: 'itunes.create',
      roles: ['user']
    });
  }
}());
