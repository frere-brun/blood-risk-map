angular.module('toggleHeight', []).directive('toggleChildHeight', function($timeout, $window) {
      return {
          scope: {
              index: '@'
          },
          link: function(scope, element, attrs) {

            var w = angular.element($window);

            $timeout(function(){

              var allBlock = angular.element(element.parent());
              var totalHeight = allBlock[0].offsetHeight;

              var linkHeight = 42;

              allBlock.css({ height: linkHeight });
                element.bind('click', function() {
                    
                    $("#accordeon ul li").each(function(){
                      if($(this).children().hasClass("open")){
                        $(this).children("header").removeClass('open');
                        $(this).children(".content-wrapper").removeClass('open');
                        $(this).css({ height: linkHeight });
                      }
                    });

                    var actualHeight = allBlock[0].offsetHeight;
                    if(linkHeight != actualHeight){
                      allBlock.css({ height: linkHeight });
                      element.removeClass('open');
                      element.next().removeClass('open');
                      $timeout(function(){
                        angular.element(allBlock.children()[3]).removeClass('open'); // last child of spin box
                      }, 500);
                    }
                    else {
                      allBlock.css({ height: totalHeight });
                      element.addClass('open');
                      element.next().addClass('open');
                      $timeout(function(){
                        angular.element(allBlock.children()[3]).addClass('open'); // last child of spin box
                      }, 500);
                    }

                });

            });

            scope.$on('resize::resize', function() {
              $timeout(function(){

                var allBlock = angular.element(element.parent());
                var totalHeight = allBlock[0].offsetHeight;
                var linkHeight = 42;
                
                allBlock.css({ height: linkHeight });
                element.removeClass('open');
                element.next().removeClass('open');

                $timeout(function(){
                  angular.element(allBlock.children()[3]).removeClass('open'); // last child of spin box
                }, 500);

              });
            });

          }
      };
  });
