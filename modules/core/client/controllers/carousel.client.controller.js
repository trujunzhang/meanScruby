(function () {
    'use strict';

    angular
        .module('core')
        .controller('CarouselController', CarouselController)
        .directive('ngRepeatOwlCarousel', repeatOwlCarousel);

    function CarouselController() {
        var vm = this;

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
