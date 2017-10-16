angular.module('resize', []).directive('resize', function($window, $rootScope) {
  return {
    link: function(scope) {
      angular.element($window).on('resize', function(e) {
        $rootScope.$broadcast('resize::resize');
      });
    }
  }
});
