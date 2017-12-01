(function () {
  'use strict';

  angular
    .module('photographers')
    .controller('PhotographersListController', PhotographersListController);

  PhotographersListController.$inject = ['PhotographersService'];

  function PhotographersListController(PhotographersService) {
    var vm = this;

    vm.photographers = PhotographersService.query();
  }
}());
