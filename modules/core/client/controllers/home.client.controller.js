(function () {
    'use strict';

    angular
        .module('core', ['duScroll'])
        .controller('HomeController', HomeController)
        .directive('ngRepeatOwlCarousel', repeatOwlCarousel)
        .directive('faqContent', faqContent);

    HomeController.$inject = ['$scope', '$document'];

    function HomeController($scope, $document) {
        var vm = this;

        //faq accordian settings
        vm.groups = [
            {
                title: 'What is Scruby?',
                content: 'Scruby is a smart downloader designed specifically for web crawling and scraping.It helps you to crawl the site quickly and reliably and reach your goals.'
            },
            {
                title: 'What tools, libraries or frameworks your site would be using for our project?',
                content: 'Scrapy is an application framework for crawling web sites and extracting structured data which can be used for a wide range of useful applications, like data mining, information processing or historical archival.'
            }
        ];

        vm.carouselInitializer = function () {
            var $carousel = $("#testimonial-carousel");
            $carousel.owlCarousel({
                items: 1,
                itemsDesktop: [1199, 1],
                itemsDesktopSmall: [980, 1],
                itemsTablet: [768, 1],
                itemsTabletSmall: [590, 1],
                itemsMobile: [479, 1],
                autoPlay: true,
                stopOnHover: true,
                pagination: false,
                transitionStyle: 'fadeUp'
            });
        };
    }

    function repeatOwlCarousel() {
        return {
            restrict: 'A',
            scope: {
                carouselInit: '&'
            },
            link: function (scope, element, attrs) {
                if ((scope.$parent != null)) {
                    return scope.carouselInit()();
                }
            }
        };
    }

    function faqContent() {
        return {
            restrict: 'E',
            scope: {
                content: '@'
            },
            templateUrl: 'modules/core/client/views/faq.content.client.direcives.html'
        };
    }

}());
