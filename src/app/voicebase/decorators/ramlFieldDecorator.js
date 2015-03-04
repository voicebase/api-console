RAML.Decorators = (function (Decorators) {
  'use strict';

  Decorators.ramlField = function ($provide) {

    $provide.decorator('ramlFieldDirective', function ($delegate, $controller) {
      var directive = $delegate[0];

      directive.templateUrl = 'voicebase/directives/voicebase-raml-field.tpl.html'; // replce template

      var controllerOrigin = directive.controller; // save original controller
      directive.controller = function ($scope) {
        angular.extend(this, $controller(controllerOrigin, {$scope: $scope})); //extend orginal controller
        var bodyContent = $scope.$parent.context.bodyContent;
        var context = $scope.$parent.context[$scope.$parent.type];
        if (bodyContent) {
          context = context || bodyContent.definitions[bodyContent.selected];
        }

        $scope.parameter = context.plain[$scope.param.id];

        $scope.isFile = function (definition) {
          return definition.type === 'file';
        };

        $scope.isDefault = function (definition) {
          return typeof definition.enum === 'undefined' && definition.type !== 'boolean' && !$scope.isFile(definition);
        };

      };

      return $delegate;
    });

  };

  return Decorators;

})(RAML.Decorators || {});
