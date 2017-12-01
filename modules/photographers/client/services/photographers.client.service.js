// Photographers service used to communicate Photographers REST endpoints
(function () {
  'use strict';

  angular
    .module('photographers')
    .factory('PhotographersService', PhotographersService);

  PhotographersService.$inject = ['$resource'];

  function PhotographersService($resource) {
    return $resource('api/photographers/:photographerId', {
      photographerId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
