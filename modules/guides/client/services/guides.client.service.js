// Guides service used to communicate Guides REST endpoints
(function () {
  'use strict';

  angular
    .module('guides')
    .factory('GuidesService', GuidesService);

  GuidesService.$inject = ['$resource'];

  function GuidesService($resource) {
    return $resource('api/guides/:guideId', {
      guideId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
