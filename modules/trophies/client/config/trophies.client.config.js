(function () {
  'use strict';

  angular
    .module('trophies')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Trophies',
      state: 'trophies',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'trophies', {
      title: 'List Trophies',
      state: 'trophies.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'trophies', {
      title: 'Create Trophy',
      state: 'trophies.create',
      roles: ['user']
    });
  }
}());
