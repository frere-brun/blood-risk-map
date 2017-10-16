angular.module('fundoo.services', []).factory('createDialog', ["$document", "$compile", "$rootScope", "$controller", "$timeout",
  function ($document, $compile, $rootScope, $controller, $timeout) {
    var defaults = {
      id: null,
      template: null,
      templateUrl: null,
      title: 'Default Title',
      videoUrl: null,
      success: {label: 'OK', fn: null},
      cancel: {label: 'Close', fn: null},
      controller: null, //just like route controller declaration
      footerTemplate: null,
      modalClass: "modal",
      isVideoClicked: false
    };
    var body = $document.find('body');

    return function Dialog(templateUrl/*optional*/, options, passedInLocals) {

      passedInLocals = options;

      options = angular.extend({}, defaults, options); //options defined in constructor

      var key;
      var idAttr = options.id ? ' id="' + options.id + '" ' : '';

      //We don't have the scope we're gonna use yet, so just get a compile function for modal //  style="display: block;"
      var modalEl = angular.element(
                '<div class="' + options.modalClass + ' fade"' + idAttr + '>' +
                    '  <div class="modal-overlay" ng-click="$modalCancel()"/>' +
                    '  <div class="modal-dialog">' +
                    '    <div class="modal-content">' +
                    '      <div class="modal-header">' +
                    '        <button type="button" class="modal-close close touch-event" ng-click="$modalCancel()"><i class="lnr lnr-cross fa-2x"/></button>' +
                    '        <h4><i class="lnr lnr-camera-video"/> {{$title}}</h4>' +
                    '      </div>' +
                    ' <div class="modal-body">' +
                      '<div id="video-container">' +
                      '  <div id="video-box" ng-init="$isVideoClicked = false">'+
                      '    <div ng-click="$videoClickMask()" ng-if="$isVideoClicked == false">' +
                      '      <div id="play">' +
                      '        <div id="triangle"></div>' +
                      '      </div><img id="video-cover" src="' + options.imgUrl + '"/>' +
                      '   </div> ' +
                      '   <iframe  ng-if="$isVideoClicked == true" frameborder="0" width="400" height="300" src="' + options.videoUrl + '?rel=0&theme=dark&color=white&autoplay=1&autohide=1&modestbranding=1&showinfo=0&rel=0&iv_load_policy=3" frameborder="1" allowfullscreen></iframe>' +
                      '  </div>' +
                      '</div>' +
                    '  </div>' +
                    '</div>');



      var handleEscPressed = function (event) {
        if (event.keyCode === 27) {
          scope.$modalCancel();
        }
      };

      var closeFn = function () {
        body.unbind('keydown', handleEscPressed);
        $('.modal-close').addClass("active");
        $timeout(function () {
          modalEl.addClass('out');
        }, 150);
        $timeout(function () {
          modalEl.remove();
          $('.modal-close').removeClass("active");
        }, 450);
      };

      body.bind('keydown', handleEscPressed);

      var ctrl, locals,
        scope = options.scope || $rootScope.$new();

      scope.$title = options.title;
      scope.$modalClose = closeFn;

      scope.$videoClickMask = function() {
        scope.$isVideoClicked = true;
      }

      scope.$modalCancel = function () {
        var callFn = options.cancel.fn || closeFn;
        callFn.call(this);
        scope.$modalClose();
      };
      scope.$modalSuccess = function () {
        var callFn = options.success.fn || closeFn;
        callFn.call(this);
        scope.$modalClose();
      };
      scope.$modalSuccessLabel = options.success.label;
      scope.$modalCancelLabel = options.cancel.label;

      $compile(modalEl)(scope);
      body.append(modalEl);

      $timeout(function () {
        modalEl.addClass('in');
      }, 100);
    };
  }]);