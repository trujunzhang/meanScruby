(function () {
  'use strict';

  angular
    .module('crawlers')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Crawlers',
      state: 'crawlers',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'crawlers', {
      title: 'List Crawlers',
      state: 'crawlers.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'crawlers', {
      title: 'Create Crawler',
      state: 'crawlers.create',
      roles: ['user']
    });
  }
}());
