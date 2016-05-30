(function () {
  'use strict';

  describe('Itunes Route Tests', function () {
    // Initialize global variables
    var $scope,
      ItunesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _ItunesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      ItunesService = _ItunesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('itunes');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/itunes');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('List Route', function () {
        var liststate;
        beforeEach(inject(function ($state) {
          liststate = $state.get('itunes.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should not be abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have template', function () {
          expect(liststate.templateUrl).toBe('modules/itunes/client/views/list-itunes.client.view.html');
        });
      });

      describe('View Route', function () {
        var viewstate,
          ItunesController,
          mockItune;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('itunes.view');
          $templateCache.put('modules/itunes/client/views/view-itune.client.view.html', '');

          // create mock itune
          mockItune = new ItunesService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Itune about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          ItunesController = $controller('ItunesController as vm', {
            $scope: $scope,
            ituneResolve: mockItune
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:ituneId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.ituneResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            ituneId: 1
          })).toEqual('/itunes/1');
        }));

        it('should attach an itune to the controller scope', function () {
          expect($scope.vm.itune._id).toBe(mockItune._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/itunes/client/views/view-itune.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          ItunesController,
          mockItune;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('itunes.create');
          $templateCache.put('modules/itunes/client/views/form-itune.client.view.html', '');

          // create mock itune
          mockItune = new ItunesService();

          // Initialize Controller
          ItunesController = $controller('ItunesController as vm', {
            $scope: $scope,
            ituneResolve: mockItune
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.ituneResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/itunes/create');
        }));

        it('should attach an itune to the controller scope', function () {
          expect($scope.vm.itune._id).toBe(mockItune._id);
          expect($scope.vm.itune._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/itunes/client/views/form-itune.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          ItunesController,
          mockItune;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('itunes.edit');
          $templateCache.put('modules/itunes/client/views/form-itune.client.view.html', '');

          // create mock itune
          mockItune = new ItunesService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Itune about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          ItunesController = $controller('ItunesController as vm', {
            $scope: $scope,
            ituneResolve: mockItune
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:ituneId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.ituneResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            ituneId: 1
          })).toEqual('/itunes/1/edit');
        }));

        it('should attach an itune to the controller scope', function () {
          expect($scope.vm.itune._id).toBe(mockItune._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/itunes/client/views/form-itune.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

      describe('Handle Trailing Slash', function () {
        beforeEach(inject(function ($state, $rootScope) {
          $state.go('itunes.list');
          $rootScope.$digest();
        }));

        it('Should remove trailing slash', inject(function ($state, $location, $rootScope) {
          $location.path('itunes/');
          $rootScope.$digest();

          expect($location.path()).toBe('/itunes');
          expect($state.current.templateUrl).toBe('modules/itunes/client/views/list-itunes.client.view.html');
        }));
      });

    });
  });
}());
