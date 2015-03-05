(function () {
  'use strict';

  RAML.Directives.voicebaseSign = function() {
    return {
      restrict: 'E',
      templateUrl: 'voicebase/directives/voicebase-sign.tpl.html',
      replace: true,
      controller: function($scope, resourceHelper, voicebaseTokensApi) {
        $scope.resource = resourceHelper.findResourceByUrl($scope.raml, '/access/users/{userId}/tokens');
        if($scope.resource) {
          $scope.methodInfo = $scope.resource.methods[0];
          $scope.context = new RAML.Services.TryIt.Context($scope.raml.baseUriParameters, $scope.resource, $scope.methodInfo);
        }

        $scope.signed = false;
        $scope.isLoaded = false;

        $scope.signIn = function() {
          if(!$scope.isLoaded) {
            $scope.showForm(); // method of voicebase-auth-form
          }
        };

        $scope.signOut = function() {
            voicebaseTokensApi.setCurrentToken('');
        };

        $scope.auth = function(credentials) {
          $scope.isLoaded = true;
          var client = RAML.Client.create($scope.raml);
          voicebaseTokensApi.getTokens(client.baseUri, credentials).then(function() {
            $scope.isLoaded = false;
          }, function(error){
            $scope.isLoaded = false;
            $scope.formError = error;
          });
        };

        $scope.$watch(function() {
          return voicebaseTokensApi.getCurrentToken();
        }, function(currentToken) {
          $scope.signed = !!currentToken;
        });
      }
    };
  };

  angular.module('RAML.Directives')
    .directive('voicebaseSign', RAML.Directives.voicebaseSign);

})();
