(function () {
  'use strict';

  RAML.Directives.editorStyles = function() {
    return {
      restrict: 'A',
      scope: {
        editorStyles: '='
      },
      link: function link(scope, element) {
        var styles = scope.editorStyles;
        element.css(styles);
      }
    };
  };

  angular.module('RAML.Directives')
    .directive('editorStyles', RAML.Directives.editorStyles);
})();
