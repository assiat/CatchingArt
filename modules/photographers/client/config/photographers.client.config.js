(function () {
  'use strict';

  angular
    .module('photographers')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Photographers',
      state: 'photographers',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'photographers', {
      title: 'List Photographers',
      state: 'photographers.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'photographers', {
      title: 'Create Photographer',
      state: 'photographers.create',
      roles: ['user']
    });
  }
}());
