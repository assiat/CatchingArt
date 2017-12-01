(function () {
  'use strict';

  angular
    .module('guides')
    .controller('GuidesListController', GuidesListController);

  GuidesListController.$inject = ['GuidesService'];

  function GuidesListController(GuidesService) {
    var vm = this;

    vm.guides = GuidesService.query();
  }
}());
