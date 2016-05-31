(function () {
  'use strict';

  describe('Itunes List Controller Tests', function () {
    // Initialize global variables
    var ItunesListController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      ItunesService,
      mockItune;

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
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _ItunesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      ItunesService = _ItunesService_;

      // create mock itune
      mockItune = new ItunesService({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Itune about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Itunes List controller.
      ItunesListController = $controller('ItunesListController as vm', {
        $scope: $scope
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('Instantiate', function () {
      var mockItuneList;

      beforeEach(function () {
        mockItuneList = [mockItune, mockItune];
      });

      it('should send a GET request and return all itunes', inject(function (ItunesService) {
        // Set POST response
        $httpBackend.expectGET('api/itunes').respond(mockItuneList);


        $httpBackend.flush();

        // Test form inputs are reset
        expect($scope.vm.itunes.length).toEqual(2);
        expect($scope.vm.itunes[0]).toEqual(mockItune);
        expect($scope.vm.itunes[1]).toEqual(mockItune);

      }));
    });
  });
}());
