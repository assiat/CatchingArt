(function () {
  'use strict';

  angular
    .module('guides')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Guides',
      state: 'guides',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'guides', {
      title: 'List Guides',
      state: 'guides.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'guides', {
      title: 'Create Guide',
      state: 'guides.create',
      roles: ['user']
    });
  }
}());
