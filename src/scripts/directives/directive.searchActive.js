angular.module('searchActive', []).directive('searchActive', function($window, $timeout) {
    return {
        scope: {
            index: '@'
        },
        link: function(scope, element, attrs) {

            // au click
            element.bind('click', function() {

                // touch event
                element.addClass('active');
                $timeout(function(){
                    element.removeClass('active');
                }, 200);

                var timer = 0;
                // si les filtres sont ouverts
                if ($("#menu").hasClass('open')){
                    timer = 200;
                    // on delay l'ouverture et on simule
                    // le click de la fermeture des filtres
                    // avant d'ouvrir
                    angular.element($("#menu-button-box i")).triggerHandler('click');
                }
                $timeout(function(){
                    // si la barre est déjà active on unfocus 
                    if ($("#search").hasClass('active'))
                        $('#search input').blur();
                    else
                        $("#search input").focus();
                    
                    $("#search").toggleClass('active');
                }, timer);
            });
        }
    };
});
