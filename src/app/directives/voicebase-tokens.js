(function () {
  'use strict';

  RAML.Directives.voicebaseTokens = function(formValidate, voicebaseTokensApi) {
    return {
      restrict: 'E',
      templateUrl: 'directives/voicebase-tokens.tpl.html',
      replace: true,
      controller: function($scope) {
        $scope.context = {
          forceRequest: false // see basic auth change event
        };
        $scope.credentials = {};
        $scope.showAuthForm = false;

        $scope.isLoaded = false;
        $scope.tokens = [];
        $scope.tokenError = '';

        $scope.showForm = function() {
          $scope.tokenError = '';
          $scope.showAuthForm = !$scope.showAuthForm;
        };

        $scope.hideForm = function() {
          $scope.showAuthForm = false;
        };

        $scope.auth = function($event) {
          var isValid = formValidate.validateForm($scope.form);
          if(!isValid) {
              jQuery($event.currentTarget).closest('form').find('.ng-invalid').first().focus();
          }
          else {
            $scope.isLoaded = true;
            $scope.hideForm();
            voicebaseTokensApi.getTokens().then(function(tokens){
              $scope.isLoaded = false;
              $scope.tokens = tokens;
            }, function(error){
              $scope.isLoaded = false;
              $scope.tokenError = error;
            });
          }
        };

        $scope.hideError = function(){
          $scope.tokenError = '';
        };
      },
      link: function (scope, element) {
        jQuery(element).find('.raml-console-dropdown').change(function(){
          var tokenId = jQuery(this).find('option:selected').val();
          voicebaseTokensApi.setCurrentToken(tokenId);
        });
      }
    };
  };

  angular.module('RAML.Directives')
    .directive('voicebaseTokens', RAML.Directives.voicebaseTokens);
})();
