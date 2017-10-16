angular.module('mobileDetect', []).directive("mobileDetect", function ($window, $timeout, $rootScope) {
  return function(scope, element, attrs) {
    
    var isMobile = function() {
        if ($(document).width() <= 1000)
            $rootScope.isMobile = true;
        else
            $rootScope.isMobile = false;
    }

    $rootScope.$on('resize::resize', function() {
        isMobile();
    });

  };

});
