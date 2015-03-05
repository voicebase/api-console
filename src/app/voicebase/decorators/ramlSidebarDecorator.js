RAML.Decorators = (function (Decorators) {
  'use strict';

  Decorators.ramlSidebar = function ($provide) {
    $provide.decorator('sidebarDirective', function ($delegate, $controller, $compile) {
      var directive = $delegate[0];

      directive.compile = function(tElement, tAttrs) {
        return {
          pre: function(scope, element, attrs) {
            var tokensTemplate = $compile('<voicebase-tokens></voicebase-tokens>')(scope);
            element.find('.raml-console-sidebar-securty').append(tokensTemplate);
          }
        }
      };

      var controllerOrigin = directive.controller; // save original controller
      directive.controller = function ($scope, $location, $anchorScroll) {
        angular.extend(this, $controller(controllerOrigin, {
          $scope: $scope,
          $location: $location,
          $anchorScroll: $anchorScroll
        })); //extend orginal controller

      };

      return $delegate;
    });

  };

  return Decorators;

})(RAML.Decorators || {});
