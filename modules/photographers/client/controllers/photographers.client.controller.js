(function () {
  'use strict';

  // Photographers controller
  angular
    .module('photographers')
    .controller('PhotographersController', PhotographersController);

  PhotographersController.$inject = ['$scope', '$state', '$window', 'Authentication', 'photographerResolve'];

  function PhotographersController ($scope, $state, $window, Authentication, photographer) {
    var vm = this;

    vm.authentication = Authentication;
    vm.photographer = photographer;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Photographer
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.photographer.$remove($state.go('photographers.list'));
      }
    }

    // Save Photographer
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.photographerForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.photographer._id) {
        vm.photographer.$update(successCallback, errorCallback);
      } else {
        vm.photographer.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('photographers.view', {
          photographerId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
