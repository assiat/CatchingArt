(function () {
  'use strict';

  angular
    .module('guides')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('guides', {
        abstract: true,
        url: '/guides',
        template: '<ui-view/>'
      })
      .state('guides.list', {
        url: '',
        templateUrl: 'modules/guides/client/views/list-guides.client.view.html',
        controller: 'GuidesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Guides List'
        }
      })
      .state('guides.create', {
        url: '/create',
        templateUrl: 'modules/guides/client/views/form-guide.client.view.html',
        controller: 'GuidesController',
        controllerAs: 'vm',
        resolve: {
          guideResolve: newGuide
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Guides Create'
        }
      })
      .state('guides.edit', {
        url: '/:guideId/edit',
        templateUrl: 'modules/guides/client/views/form-guide.client.view.html',
        controller: 'GuidesController',
        controllerAs: 'vm',
        resolve: {
          guideResolve: getGuide
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Guide {{ guideResolve.name }}'
        }
      })
      .state('guides.view', {
        url: '/:guideId',
        templateUrl: 'modules/guides/client/views/view-guide.client.view.html',
        controller: 'GuidesController',
        controllerAs: 'vm',
        resolve: {
          guideResolve: getGuide
        },
        data: {
          pageTitle: 'Guide {{ guideResolve.name }}'
        }
      });
  }

  getGuide.$inject = ['$stateParams', 'GuidesService'];

  function getGuide($stateParams, GuidesService) {
    return GuidesService.get({
      guideId: $stateParams.guideId
    }).$promise;
  }

  newGuide.$inject = ['GuidesService'];

  function newGuide(GuidesService) {
    return new GuidesService();
  }
}());
