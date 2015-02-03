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

        var getResource = function() {
          $scope.resource = null;
          var res = $scope.raml.resources.filter(function(resource) {
            return resource.toString() === '/access/users/{userId}/tokens';
          });
          if(res.length > 0) {
            $scope.resource = angular.copy(res[0]);
            delete $scope.resource.uriParametersForDocumentation.userId;
          }

          $scope.methodInfo = $scope.resource.methods[0];
          $scope.context = new RAML.Services.TryIt.Context($scope.raml.baseUriParameters, $scope.resource, $scope.methodInfo);
          toUIModel($scope.resource.uriParametersForDocumentation);
        };
        getResource();

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
            voicebaseTokensApi.getTokens($scope.credentials, $scope.context.uriParameters.values).then(function(tokens){
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

        function toUIModel (collection) {
          if(collection) {
            Object.keys(collection).map(function (key) {
              collection[key][0].id = key;
            });
          }
        }

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
