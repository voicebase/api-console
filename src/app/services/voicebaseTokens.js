(function () {
  'use strict';

  RAML.Services.VoicebaseTokensApi = function($http, $q) {
    var tokens = [];
    var currentToken = '';

    var setCurrentToken = function(tokenId){
        currentToken = tokens[tokenId];
    };

    var getCurrentToken = function(){
        return currentToken;
    };

    var getTokens = function(){
      var deferred = $q.defer();

      setTimeout(function(){
        tokens = [
          '123123',
          '234234',
          '345345'
        ];
        deferred.resolve(tokens);
        //deferred.reject('Something goes wrong!');
      }, 3000);

      return deferred.promise;
    };

    return {
      getTokens: getTokens,
      getCurrentToken: getCurrentToken,
      setCurrentToken: setCurrentToken
    };

  };

  angular.module('RAML.Services')
    .service('voicebaseTokensApi', RAML.Services.VoicebaseTokensApi);

})();
