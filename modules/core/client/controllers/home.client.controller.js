(function () {
    'use strict';

    angular
        .module('core', ['duScroll'])
        .controller('HomeController', HomeController)
        .directive('ngRepeatOwlCarousel', repeatOwlCarousel);

    HomeController.$inject = ['$scope', '$document'];

    function HomeController($scope, $document) {
        var vm = this;

        vm.carouselInitializer = function() {
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

        var top = 400;
        var duration = 2000; //milliseconds

        //Scroll to the exact position
        // $document.scrollTop(top, duration).then(function () {
        //     console && console.log('You just scrolled to the top!');
        // });

        var offset = 30; //pixels; adjust for floating menu, context etc
        //Scroll to #some-id with 30 px "padding"
        //Note: Use this in a directive, not with document.getElementById
        // var someElement = angular.element(document.getElementById('some-id'));
        // $document.scrollToElement(someElement, offset, duration);

    }

    function repeatOwlCarousel() {
        return {
            restrict: 'A',
            scope: {
                carouselInit: '&'
            },
            link: function(scope, element, attrs) {
                if ((scope.$parent != null)) {
                    return scope.carouselInit()();
                }
            }
        };
    }
    
}());
