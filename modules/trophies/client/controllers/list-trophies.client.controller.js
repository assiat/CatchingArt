(function () {
  'use strict';

  angular
    .module('trophies')
    .controller('TrophiesListController', TrophiesListController);

  TrophiesListController.$inject = ['TrophiesService'];

  function TrophiesListController(TrophiesService) {
    var vm = this;

    vm.trophies = TrophiesService.query();
  }
}());
