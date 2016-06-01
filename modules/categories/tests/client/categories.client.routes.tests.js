(function () {
  'use strict';

  describe('Categories Route Tests', function () {
    // Initialize global variables
    var $scope,
      CategoriesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _CategoriesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      CategoriesService = _CategoriesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('categories');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/categories');
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
          liststate = $state.get('categories.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should not be abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have template', function () {
          expect(liststate.templateUrl).toBe('modules/categories/client/views/list-categories.client.view.html');
        });
      });

      describe('View Route', function () {
        var viewstate,
          CategoriesController,
          mockCategory;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('categories.view');
          $templateCache.put('modules/categories/client/views/view-crawler.client.view.html', '');

          // create mock crawler
          mockCategory = new CategoriesService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Category about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          CategoriesController = $controller('CategoriesController as vm', {
            $scope: $scope,
            crawlerResolve: mockCategory
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:crawlerId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.crawlerResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            crawlerId: 1
          })).toEqual('/categories/1');
        }));

        it('should attach an crawler to the controller scope', function () {
          expect($scope.vm.crawler._id).toBe(mockCategory._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/categories/client/views/view-crawler.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          CategoriesController,
          mockCategory;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('categories.create');
          $templateCache.put('modules/categories/client/views/form-crawler.client.view.html', '');

          // create mock crawler
          mockCategory = new CategoriesService();

          // Initialize Controller
          CategoriesController = $controller('CategoriesController as vm', {
            $scope: $scope,
            crawlerResolve: mockCategory
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.crawlerResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/categories/create');
        }));

        it('should attach an crawler to the controller scope', function () {
          expect($scope.vm.crawler._id).toBe(mockCategory._id);
          expect($scope.vm.crawler._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/categories/client/views/form-crawler.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          CategoriesController,
          mockCategory;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('categories.edit');
          $templateCache.put('modules/categories/client/views/form-crawler.client.view.html', '');

          // create mock crawler
          mockCategory = new CategoriesService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Category about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          CategoriesController = $controller('CategoriesController as vm', {
            $scope: $scope,
            crawlerResolve: mockCategory
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:crawlerId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.crawlerResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            crawlerId: 1
          })).toEqual('/categories/1/edit');
        }));

        it('should attach an crawler to the controller scope', function () {
          expect($scope.vm.crawler._id).toBe(mockCategory._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/categories/client/views/form-crawler.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

      describe('Handle Trailing Slash', function () {
        beforeEach(inject(function ($state, $rootScope) {
          $state.go('categories.list');
          $rootScope.$digest();
        }));

        it('Should remove trailing slash', inject(function ($state, $location, $rootScope) {
          $location.path('categories/');
          $rootScope.$digest();

          expect($location.path()).toBe('/categories');
          expect($state.current.templateUrl).toBe('modules/categories/client/views/list-categories.client.view.html');
        }));
      });

    });
  });
}());
