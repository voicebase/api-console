(function () {
  'use strict';

  RAML.Directives.voicebaseTokens = function() {
    return {
      restrict: 'E',
      templateUrl: 'directives/voicebase-tokens.tpl.html',
      replace: true,
      controller: function($scope) {
        $scope.showAuthForm = false;

        $scope.showForm = function() {
          $scope.showAuthForm = !$scope.showAuthForm;
        };

        $scope.hideForm = function() {
          $scope.showAuthForm = false;
        };

        $scope.auth = function() {

        };
      }
    };
  };

  angular.module('RAML.Directives')
    .directive('voicebaseTokens', RAML.Directives.voicebaseTokens);
})();
