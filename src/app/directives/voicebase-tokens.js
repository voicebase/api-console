(function () {
  'use strict';

  RAML.Directives.voicebaseTokens = function() {
    return {
      restrict: 'E',
      templateUrl: 'directives/voicebase-tokens.tpl.html',
      replace: true,
      controller: function($scope, formValidate, voicebaseTokensApi) {
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

            $scope.methodInfo = $scope.resource.methods[0];
            $scope.context = new RAML.Services.TryIt.Context($scope.raml.baseUriParameters, $scope.resource, $scope.methodInfo);
            toUIModel($scope.resource.uriParametersForDocumentation);
          }
        };
        getResource();

        $scope.isLoaded = false;
        $scope.tokens = [];
        $scope.tokenError = '';
        $scope.selectedToken = null;

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
            var client = RAML.Client.create($scope.raml);
            voicebaseTokensApi.getTokens(client.baseUri, $scope.credentials).then(initTokens, function(error){
              $scope.isLoaded = false;
              $scope.tokenError = error;
            });
          }
        };

        var initTokens = function(tokensData) {
          $scope.isLoaded = false;
          $scope.tokens = tokensData.tokens;
          if($scope.tokens.length > 0) {
            $scope.selectedToken = $scope.tokens[0];
            $scope.setAuthHeaderForAjax();
          }
        };

        $scope.setAuthHeaderForAjax = function() {
          var tokenObj = $scope.selectedToken;
          voicebaseTokensApi.setCurrentToken(tokenObj);
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
            $scope.setAuthHeaderForAjax();
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
