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
    //RAML.Decorators.ramlConsole($provide);
    RAML.Decorators.ramlField($provide);
  });


})();
