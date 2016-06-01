(function () {
  'use strict';

  describe('Crawlers Route Tests', function () {
    // Initialize global variables
    var $scope,
      CrawlersService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _CrawlersService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      CrawlersService = _CrawlersService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('crawlers');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/crawlers');
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
          liststate = $state.get('crawlers.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should not be abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have template', function () {
          expect(liststate.templateUrl).toBe('modules/crawlers/client/views/list-crawlers.client.view.html');
        });
      });

      describe('View Route', function () {
        var viewstate,
          CrawlersController,
          mockCrawler;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('crawlers.view');
          $templateCache.put('modules/crawlers/client/views/view-crawler.client.view.html', '');

          // create mock crawler
          mockCrawler = new CrawlersService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Crawler about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          CrawlersController = $controller('CrawlersController as vm', {
            $scope: $scope,
            crawlerResolve: mockCrawler
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
          })).toEqual('/crawlers/1');
        }));

        it('should attach an crawler to the controller scope', function () {
          expect($scope.vm.crawler._id).toBe(mockCrawler._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/crawlers/client/views/view-crawler.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          CrawlersController,
          mockCrawler;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('crawlers.create');
          $templateCache.put('modules/crawlers/client/views/form-crawler.client.view.html', '');

          // create mock crawler
          mockCrawler = new CrawlersService();

          // Initialize Controller
          CrawlersController = $controller('CrawlersController as vm', {
            $scope: $scope,
            crawlerResolve: mockCrawler
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
          expect($state.href(createstate)).toEqual('/crawlers/create');
        }));

        it('should attach an crawler to the controller scope', function () {
          expect($scope.vm.crawler._id).toBe(mockCrawler._id);
          expect($scope.vm.crawler._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/crawlers/client/views/form-crawler.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          CrawlersController,
          mockCrawler;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('crawlers.edit');
          $templateCache.put('modules/crawlers/client/views/form-crawler.client.view.html', '');

          // create mock crawler
          mockCrawler = new CrawlersService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Crawler about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          CrawlersController = $controller('CrawlersController as vm', {
            $scope: $scope,
            crawlerResolve: mockCrawler
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
          })).toEqual('/crawlers/1/edit');
        }));

        it('should attach an crawler to the controller scope', function () {
          expect($scope.vm.crawler._id).toBe(mockCrawler._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/crawlers/client/views/form-crawler.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

      describe('Handle Trailing Slash', function () {
        beforeEach(inject(function ($state, $rootScope) {
          $state.go('crawlers.list');
          $rootScope.$digest();
        }));

        it('Should remove trailing slash', inject(function ($state, $location, $rootScope) {
          $location.path('crawlers/');
          $rootScope.$digest();

          expect($location.path()).toBe('/crawlers');
          expect($state.current.templateUrl).toBe('modules/crawlers/client/views/list-crawlers.client.view.html');
        }));
      });

    });
  });
}());
