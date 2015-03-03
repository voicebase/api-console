(function () {
  'use strict';

  angular.module('ramlVoicebaseConsoleApp', [
    'RAML.Directives',
    'RAML.Services',
    'RAML.Security',
    'hc.marked',
    'ui.codemirror',
    'hljs',
    'ramlConsoleApp'
  ]).config(function ($provide) {
    $provide.decorator('ramlConsoleDirective', function ($delegate, $controller, $timeout, $compile) {
      var directive = $delegate[0];

      var controllerOrigin = directive.controller; // save original controller
      directive.controller = function ($scope, $window, $attrs) {
        angular.extend(this, $controller(controllerOrigin, {$scope: $scope, $window: $window, $attrs: $attrs})); //extend orginal controller
        $scope.$watch('loaded', function () {
          if ($scope.loaded) {
            $timeout(function () {
              var el = $compile('<voicebase-sign></voicebase-sign>')($scope);
              jQuery('#raml-console-documentation-container').before(el);
            }, 0);
          }
        });
      };

      return $delegate;
    });

  });


})();
