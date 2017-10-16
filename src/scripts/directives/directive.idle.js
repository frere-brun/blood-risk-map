angular.module('idle', []).directive('detectIdle', function($window, $timeout, $rootScope) {
    return {
        scope: {
            index: '@'
        },
        link: function(scope, element, attrs) {

            var atomicTemporalValue = 1000; // 1 sec
            var timeToBroadcast = 60; // 10 sec * 1

            var totalTime = atomicTemporalValue * timeToBroadcast;

            function idleBroadcast() {

                var t;
                window.onload = resetTimer;
                window.onmousemove = resetTimer;
                window.onmousedown = resetTimer; // catches touchscreen presses
                window.onclick = resetTimer;     // catches touchpad clicks
                window.onscroll = resetTimer;    // catches scrolling with arrow keys
                window.onkeypress = resetTimer;

                function broadCast() {
                    if ($rootScope.isMapLoaded)
                        $rootScope.$broadcast('idle::idle');
                }

                function resetTimer() {
                    clearTimeout(t);
                    t = setTimeout(broadCast, totalTime);  // time is in milliseconds
                }
            }

            idleBroadcast();
        }
    };
});
