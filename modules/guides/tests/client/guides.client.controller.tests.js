(function () {
  'use strict';

  describe('Guides Controller Tests', function () {
    // Initialize global variables
    var GuidesController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      GuidesService,
      mockGuide;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _GuidesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      GuidesService = _GuidesService_;

      // create mock Guide
      mockGuide = new GuidesService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Guide Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Guides controller.
      GuidesController = $controller('GuidesController as vm', {
        $scope: $scope,
        guideResolve: {}
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('vm.save() as create', function () {
      var sampleGuidePostData;

      beforeEach(function () {
        // Create a sample Guide object
        sampleGuidePostData = new GuidesService({
          name: 'Guide Name'
        });

        $scope.vm.guide = sampleGuidePostData;
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (GuidesService) {
        // Set POST response
        $httpBackend.expectPOST('api/guides', sampleGuidePostData).respond(mockGuide);

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL redirection after the Guide was created
        expect($state.go).toHaveBeenCalledWith('guides.view', {
          guideId: mockGuide._id
        });
      }));

      it('should set $scope.vm.error if error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/guides', sampleGuidePostData).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      });
    });

    describe('vm.save() as update', function () {
      beforeEach(function () {
        // Mock Guide in $scope
        $scope.vm.guide = mockGuide;
      });

      it('should update a valid Guide', inject(function (GuidesService) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/guides\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($state.go).toHaveBeenCalledWith('guides.view', {
          guideId: mockGuide._id
        });
      }));

      it('should set $scope.vm.error if error', inject(function (GuidesService) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/guides\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      }));
    });

    describe('vm.remove()', function () {
      beforeEach(function () {
        // Setup Guides
        $scope.vm.guide = mockGuide;
      });

      it('should delete the Guide and redirect to Guides', function () {
        // Return true on confirm message
        spyOn(window, 'confirm').and.returnValue(true);

        $httpBackend.expectDELETE(/api\/guides\/([0-9a-fA-F]{24})$/).respond(204);

        $scope.vm.remove();
        $httpBackend.flush();

        expect($state.go).toHaveBeenCalledWith('guides.list');
      });

      it('should should not delete the Guide and not redirect', function () {
        // Return false on confirm message
        spyOn(window, 'confirm').and.returnValue(false);

        $scope.vm.remove();

        expect($state.go).not.toHaveBeenCalled();
      });
    });
  });
}());
