(function () {
  'use strict';

  describe('Trophies Route Tests', function () {
    // Initialize global variables
    var $scope,
      TrophiesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _TrophiesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      TrophiesService = _TrophiesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('trophies');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/trophies');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          TrophiesController,
          mockTrophy;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('trophies.view');
          $templateCache.put('modules/trophies/client/views/view-trophy.client.view.html', '');

          // create mock Trophy
          mockTrophy = new TrophiesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Trophy Name'
          });

          // Initialize Controller
          TrophiesController = $controller('TrophiesController as vm', {
            $scope: $scope,
            trophyResolve: mockTrophy
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:trophyId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.trophyResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            trophyId: 1
          })).toEqual('/trophies/1');
        }));

        it('should attach an Trophy to the controller scope', function () {
          expect($scope.vm.trophy._id).toBe(mockTrophy._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/trophies/client/views/view-trophy.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          TrophiesController,
          mockTrophy;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('trophies.create');
          $templateCache.put('modules/trophies/client/views/form-trophy.client.view.html', '');

          // create mock Trophy
          mockTrophy = new TrophiesService();

          // Initialize Controller
          TrophiesController = $controller('TrophiesController as vm', {
            $scope: $scope,
            trophyResolve: mockTrophy
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.trophyResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/trophies/create');
        }));

        it('should attach an Trophy to the controller scope', function () {
          expect($scope.vm.trophy._id).toBe(mockTrophy._id);
          expect($scope.vm.trophy._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/trophies/client/views/form-trophy.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          TrophiesController,
          mockTrophy;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('trophies.edit');
          $templateCache.put('modules/trophies/client/views/form-trophy.client.view.html', '');

          // create mock Trophy
          mockTrophy = new TrophiesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Trophy Name'
          });

          // Initialize Controller
          TrophiesController = $controller('TrophiesController as vm', {
            $scope: $scope,
            trophyResolve: mockTrophy
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:trophyId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.trophyResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            trophyId: 1
          })).toEqual('/trophies/1/edit');
        }));

        it('should attach an Trophy to the controller scope', function () {
          expect($scope.vm.trophy._id).toBe(mockTrophy._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/trophies/client/views/form-trophy.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
