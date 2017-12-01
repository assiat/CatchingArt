(function () {
  'use strict';

  angular
    .module('photographers')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('photographers', {
        abstract: true,
        url: '/photographers',
        template: '<ui-view/>'
      })
      .state('photographers.list', {
        url: '',
        templateUrl: 'modules/photographers/client/views/list-photographers.client.view.html',
        controller: 'PhotographersListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Photographers List'
        }
      })
      .state('photographers.create', {
        url: '/create',
        templateUrl: 'modules/photographers/client/views/form-photographer.client.view.html',
        controller: 'PhotographersController',
        controllerAs: 'vm',
        resolve: {
          photographerResolve: newPhotographer
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Photographers Create'
        }
      })
      .state('photographers.edit', {
        url: '/:photographerId/edit',
        templateUrl: 'modules/photographers/client/views/form-photographer.client.view.html',
        controller: 'PhotographersController',
        controllerAs: 'vm',
        resolve: {
          photographerResolve: getPhotographer
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Photographer {{ photographerResolve.name }}'
        }
      })
      .state('photographers.view', {
        url: '/:photographerId',
        templateUrl: 'modules/photographers/client/views/view-photographer.client.view.html',
        controller: 'PhotographersController',
        controllerAs: 'vm',
        resolve: {
          photographerResolve: getPhotographer
        },
        data: {
          pageTitle: 'Photographer {{ photographerResolve.name }}'
        }
      });
  }

  getPhotographer.$inject = ['$stateParams', 'PhotographersService'];

  function getPhotographer($stateParams, PhotographersService) {
    return PhotographersService.get({
      photographerId: $stateParams.photographerId
    }).$promise;
  }

  newPhotographer.$inject = ['PhotographersService'];

  function newPhotographer(PhotographersService) {
    return new PhotographersService();
  }
}());
