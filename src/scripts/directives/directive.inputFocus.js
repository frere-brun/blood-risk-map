
angular.module('inputFocus', []).directive("inputFocus", function ($rootScope, $window, $timeout) {
  return function(scope, element, attrs) {
        element.bind("focus", function(scope) {
            // on broadcast l'evenement d'ouverture de clavier
            $rootScope.$broadcast('keyboardOpen::keyboardOpen');
            
            element.parent().addClass('focus');
        });
        element.bind("blur", function(scope) {
            // on broadcast l'evenement de fermeture du clavier
            $timeout(function(){
                $rootScope.$broadcast('keyboardClose::keyboardClose');
            }, 1000);
            // if not pristine or if input is empty, then remove focus
            if(element.hasClass('ng-pristine') || element.val().length == 0)
                element.parent().removeClass('focus');
        });
    };
});
