(function () {
  'use strict';

  describe('Guides Route Tests', function () {
    // Initialize global variables
    var $scope,
      GuidesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _GuidesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      GuidesService = _GuidesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('guides');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/guides');
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
          GuidesController,
          mockGuide;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('guides.view');
          $templateCache.put('modules/guides/client/views/view-guide.client.view.html', '');

          // create mock Guide
          mockGuide = new GuidesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Guide Name'
          });

          // Initialize Controller
          GuidesController = $controller('GuidesController as vm', {
            $scope: $scope,
            guideResolve: mockGuide
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:guideId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.guideResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            guideId: 1
          })).toEqual('/guides/1');
        }));

        it('should attach an Guide to the controller scope', function () {
          expect($scope.vm.guide._id).toBe(mockGuide._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/guides/client/views/view-guide.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          GuidesController,
          mockGuide;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('guides.create');
          $templateCache.put('modules/guides/client/views/form-guide.client.view.html', '');

          // create mock Guide
          mockGuide = new GuidesService();

          // Initialize Controller
          GuidesController = $controller('GuidesController as vm', {
            $scope: $scope,
            guideResolve: mockGuide
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.guideResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/guides/create');
        }));

        it('should attach an Guide to the controller scope', function () {
          expect($scope.vm.guide._id).toBe(mockGuide._id);
          expect($scope.vm.guide._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/guides/client/views/form-guide.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          GuidesController,
          mockGuide;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('guides.edit');
          $templateCache.put('modules/guides/client/views/form-guide.client.view.html', '');

          // create mock Guide
          mockGuide = new GuidesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Guide Name'
          });

          // Initialize Controller
          GuidesController = $controller('GuidesController as vm', {
            $scope: $scope,
            guideResolve: mockGuide
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:guideId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.guideResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            guideId: 1
          })).toEqual('/guides/1/edit');
        }));

        it('should attach an Guide to the controller scope', function () {
          expect($scope.vm.guide._id).toBe(mockGuide._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/guides/client/views/form-guide.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
