(function () {
  'use strict';

  RAML.Directives.voicebaseTokens = function() {
    return {
      restrict: 'E',
      templateUrl: 'voicebase/directives/voicebase-tokens.tpl.html',
      replace: true,
      controller: function($scope, voicebaseTokensApi) {

        $scope.isLoaded = false;
        $scope.tokens = [];
        $scope.selectedToken = null;

        $scope.auth = function(credentials) {
          $scope.isLoaded = true;
          var client = RAML.Client.create($scope.raml);
          voicebaseTokensApi.getTokens(client.baseUri, credentials).then(function() {
          }, function(error){
            $scope.isLoaded = false;
            $scope.formError = error;
          });
        };

        $scope.$watch(function() {
          return voicebaseTokensApi.getTokensObj();
        }, function(tokensData) {
            initTokens(tokensData);
        });

        $scope.$watch(function() {
          return voicebaseTokensApi.getCurrentToken();
        }, function(currentToken) {
            $scope.selectedToken = currentToken;
        });

        var initTokens = function(tokensData) {
          $scope.isLoaded = false;
          if(tokensData) {
            $scope.tokens = tokensData.tokens;
          }
          else {
            $scope.tokens = [];
          }
        };

        $scope.tokenChange = function(_selectedToken) {
          voicebaseTokensApi.setCurrentToken(_selectedToken);
        };

        var getTokenFromLocation = function() {
          var params = getParametersFromLocation();
          if(params.access_token) {
            initTokens({
              tokens: [{
                token: params.access_token,
                type: 'Bearer'
              }]
            });
          }
        };

        var getParametersFromLocation = function() {
          var urlSearch = location.search.substr(1);
          var params = urlSearch.split('&');
          var values = {};
          for (var i = 0; i < params.length; i++) {
            var param = params[i];
            if(param && param !== '') {
              var pair = param.split('=');
              values[pair[0]] = pair[1];
            }
          }
          return values;
        };

        getTokenFromLocation();
      }
    };
  };

  angular.module('RAML.Directives')
    .directive('voicebaseTokens', RAML.Directives.voicebaseTokens);
})();
