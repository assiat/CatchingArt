(function () {
  'use strict';

  angular
    .module('trophies')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('trophies', {
        abstract: true,
        url: '/trophies',
        template: '<ui-view/>'
      })
      .state('trophies.list', {
        url: '',
        templateUrl: 'modules/trophies/client/views/list-trophies.client.view.html',
        controller: 'TrophiesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Trophies List'
        }
      })
      .state('trophies.create', {
        url: '/create',
        templateUrl: 'modules/trophies/client/views/form-trophy.client.view.html',
        controller: 'TrophiesController',
        controllerAs: 'vm',
        resolve: {
          trophyResolve: newTrophy
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Trophies Create'
        }
      })
      .state('trophies.edit', {
        url: '/:trophyId/edit',
        templateUrl: 'modules/trophies/client/views/form-trophy.client.view.html',
        controller: 'TrophiesController',
        controllerAs: 'vm',
        resolve: {
          trophyResolve: getTrophy
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Trophy {{ trophyResolve.name }}'
        }
      })
      .state('trophies.view', {
        url: '/:trophyId',
        templateUrl: 'modules/trophies/client/views/view-trophy.client.view.html',
        controller: 'TrophiesController',
        controllerAs: 'vm',
        resolve: {
          trophyResolve: getTrophy
        },
        data: {
          pageTitle: 'Trophy {{ trophyResolve.name }}'
        }
      });
  }

  getTrophy.$inject = ['$stateParams', 'TrophiesService'];

  function getTrophy($stateParams, TrophiesService) {
    return TrophiesService.get({
      trophyId: $stateParams.trophyId
    }).$promise;
  }

  newTrophy.$inject = ['TrophiesService'];

  function newTrophy(TrophiesService) {
    return new TrophiesService();
  }
}());
