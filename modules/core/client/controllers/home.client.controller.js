(function () {
    'use strict';

    angular
        .module('core', ['duScroll'])
        .controller('HomeController', HomeController)
        .directive('ngRepeatOwlCarousel', repeatOwlCarousel)
        .filter("sanitize", ['$sce', function ($sce) {
            return function (htmlCode) {
                return $sce.trustAsHtml(htmlCode);
            }
        }]);

    HomeController.$inject = ['$scope', '$document'];

    function HomeController($scope, $document) {
        var vm = this;

        //faq accordian settings
        vm.groups = [
            {
                title: 'What is Scruby?',
                content: '<p>Scruby is a smart downloader designed specifically for web crawling and scraping.It helps you to crawl the site quickly and reliably and reach your goals.</p>'
            },
            {
                title: 'What tools, libraries or frameworks your site would be using for our project?',
                content: '<p>Scrapy is an application framework for crawling web sites and extracting structured data which can be used for a wide range of useful applications, like data mining, information processing or historical archival.</p>' +
                '<p>This site scruby, built with ruby on rails. Support for exporting to excel automatically.</p>' +
                '<p>We use mongo, nosql to store all crawled items, may scale well(ie. millions)</p>'
            },
            {
                title: 'How can you prevent your Scrapy bot from getting banned?',
                content: '<p>Some websites implement certain measures to prevent bots from crawling them, with varying degrees of sophistication.Getting around those measures can be difficult and tricky, and may sometimes require special infrastructure.</p>' +
                '<p>We have IPs from 50+ countries available on request.</p>'
            }, {
                title: 'We need to crawl a site every week?',
                content: '<p>Of course, No problem. We can crawl the site and send the data to your email every week.</p>'
            }, {
                title: 'Your price is too high?',
                content: '<p>No. so inexpensive. Not like other paid website, Scruby is low price and high quality.</p>'
            }, {
                title: 'How do I contact you?',
                content: '<p>If you need further assistance, please contact one of our customer service specialists:</p>' +
                '<p>By email, at trujunzhang@gmail.com</p>' +
                '<p>By clicking on the Contact Us link at the footer of homepage of our website.</p>'
            }, {
                title: 'Can I use  Scruby in my mobile phone?',
                content: '<p>Yes, Scruby is a Responsive, Mobile-Friendly Website.</p>' +
                '<p>You can use mobile web browser to browse it.</p>'
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


}());
