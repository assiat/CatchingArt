(function () {
  'use strict';

  describe('Photographers Route Tests', function () {
    // Initialize global variables
    var $scope,
      PhotographersService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _PhotographersService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      PhotographersService = _PhotographersService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('photographers');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/photographers');
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
          PhotographersController,
          mockPhotographer;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('photographers.view');
          $templateCache.put('modules/photographers/client/views/view-photographer.client.view.html', '');

          // create mock Photographer
          mockPhotographer = new PhotographersService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Photographer Name'
          });

          // Initialize Controller
          PhotographersController = $controller('PhotographersController as vm', {
            $scope: $scope,
            photographerResolve: mockPhotographer
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:photographerId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.photographerResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            photographerId: 1
          })).toEqual('/photographers/1');
        }));

        it('should attach an Photographer to the controller scope', function () {
          expect($scope.vm.photographer._id).toBe(mockPhotographer._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/photographers/client/views/view-photographer.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          PhotographersController,
          mockPhotographer;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('photographers.create');
          $templateCache.put('modules/photographers/client/views/form-photographer.client.view.html', '');

          // create mock Photographer
          mockPhotographer = new PhotographersService();

          // Initialize Controller
          PhotographersController = $controller('PhotographersController as vm', {
            $scope: $scope,
            photographerResolve: mockPhotographer
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.photographerResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/photographers/create');
        }));

        it('should attach an Photographer to the controller scope', function () {
          expect($scope.vm.photographer._id).toBe(mockPhotographer._id);
          expect($scope.vm.photographer._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/photographers/client/views/form-photographer.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          PhotographersController,
          mockPhotographer;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('photographers.edit');
          $templateCache.put('modules/photographers/client/views/form-photographer.client.view.html', '');

          // create mock Photographer
          mockPhotographer = new PhotographersService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Photographer Name'
          });

          // Initialize Controller
          PhotographersController = $controller('PhotographersController as vm', {
            $scope: $scope,
            photographerResolve: mockPhotographer
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:photographerId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.photographerResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            photographerId: 1
          })).toEqual('/photographers/1/edit');
        }));

        it('should attach an Photographer to the controller scope', function () {
          expect($scope.vm.photographer._id).toBe(mockPhotographer._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/photographers/client/views/form-photographer.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
