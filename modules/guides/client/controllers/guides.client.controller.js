(function () {
  'use strict';

  // Guides controller
  angular
    .module('guides')
    .controller('GuidesController', GuidesController);

  GuidesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'guideResolve'];

  function GuidesController ($scope, $state, $window, Authentication, guide) {
    var vm = this;

    vm.authentication = Authentication;
    vm.guide = guide;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Guide
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.guide.$remove($state.go('guides.list'));
      }
    }

    // Save Guide
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.guideForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.guide._id) {
        vm.guide.$update(successCallback, errorCallback);
      } else {
        vm.guide.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('guides.view', {
          guideId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
