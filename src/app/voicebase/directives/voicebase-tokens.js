(function () {
  'use strict';

  RAML.Directives.voicebaseTokens = function() {
    return {
      restrict: 'E',
      templateUrl: 'voicebase/directives/voicebase-tokens.tpl.html',
      replace: true,
      controller: function($scope, resourceHelper, voicebaseTokensApi) {

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

        var initTokens = function(tokensData) {
          $scope.isLoaded = false;
          if(tokensData) {
            $scope.tokens = tokensData.tokens;
            if($scope.tokens && $scope.tokens.length > 0) {
              $scope.selectedToken = $scope.tokens[0];
              //$scope.setAuthHeaderForAjax();
            }
          }
          else {
            $scope.tokens = [];
          }
        };

        $scope.setAuthHeaderForAjax = function() {
          var tokenObj = $scope.selectedToken;
          var tokenText = (tokenObj) ? tokenObj.token : null;
          if(tokenText && tokenObj.type === 'Bearer') {
            jQuery.ajaxSetup({
              beforeSend: function(xhr, settings) {
                if(settings.url.indexOf('voicebase') !== -1 && settings.scheme.indexOf('OAuth') !== -1) {
                  xhr.setRequestHeader('Authorization', 'Bearer ' + tokenText);
                }
              }
            });
          }
        };

        $scope.tokenChange = function() {
            //$scope.setAuthHeaderForAjax();
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
