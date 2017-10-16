angular.module('toggleTouchActive', []).directive('toggleTouchActive', function($window, $timeout) {
    return {
        scope: {
            index: '@'
        },
        link: function(scope, element, attrs) {

            element.bind('click', function() {
                element.addClass('active');
                $timeout(function() {
                    element.removeClass('active');
                }, 200);
            });

        }
    };
});