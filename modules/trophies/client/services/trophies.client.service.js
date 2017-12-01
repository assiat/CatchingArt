// Trophies service used to communicate Trophies REST endpoints
(function () {
  'use strict';

  angular
    .module('trophies')
    .factory('TrophiesService', TrophiesService);

  TrophiesService.$inject = ['$resource'];

  function TrophiesService($resource) {
    return $resource('api/trophies/:trophyId', {
      trophyId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
