angular.module('toggleActive', []).directive('toggleActive', function($window) {
    return {
        scope: {
            index: '@'
        },
        link: function(scope, element, attrs) {
            element.bind('click', function() {
                element.toggleClass('active');
            });
        }
    };
});
