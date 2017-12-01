(function () {
  'use strict';

  // Trophies controller
  angular
    .module('trophies')
    .controller('TrophiesController', TrophiesController);

  TrophiesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'trophyResolve'];

  function TrophiesController ($scope, $state, $window, Authentication, trophy) {
    var vm = this;

    vm.authentication = Authentication;
    vm.trophy = trophy;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Trophy
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.trophy.$remove($state.go('trophies.list'));
      }
    }

    // Save Trophy
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.trophyForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.trophy._id) {
        vm.trophy.$update(successCallback, errorCallback);
      } else {
        vm.trophy.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('trophies.view', {
          trophyId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
