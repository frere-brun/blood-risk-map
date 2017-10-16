angular.module('forceTouchUI', []).directive("forceTouchUI", function ($window, $timeout) {
  return function(scope, element, attrs) {
        var forceTouchUI = function(){
            // Trick the API into thinking we are using an android-like device to get the touch UI
            var newUserAgent = navigator.userAgent.toLowerCase();
            var osBlacklist = ['x11', 'macintosh', 'windows'];
            for(var i = 0; i < osBlacklist.length; ++i){
                newUserAgent = newUserAgent.replace(osBlacklist[i], 'android');
            }
            navigator.__defineGetter__('userAgent', function(){
                return newUserAgent;
            });
        }
        if('ontouchstart' in window || window.DocumentTouch && document instanceof DocumentTouch)
            forceTouchUI();
    };
});
