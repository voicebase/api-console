(function () {
  'use strict';

  RAML.Directives.voicebaseSign = function() {
    return {
      restrict: 'E',
      templateUrl: 'voicebase/directives/voicebase-sign.tpl.html',
      replace: true,
      controller: function(/*$scope, formValidate, voicebaseTokensApi*/) {

      }
    };
  };

  angular.module('RAML.Directives')
    .directive('voicebaseSign', RAML.Directives.voicebaseSign);

})();
