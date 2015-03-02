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

    var getTokens = function(url, credentials) {
      var deferred = $q.defer();

      var username = credentials.username;
      var password = credentials.password;

      jQuery.ajax({
        url: url + '/access/users/+' + username.toLowerCase() + '/tokens',
        type: 'GET',
        dataType: 'json',
        headers: {
          'Authorization': 'Basic ' + btoa(username + ':' + password)
        },
        success: function(tokens) {
          deferred.resolve(tokens);
        },
        error: function(jqXHR, textStatus, errorThrown){
          console.log(errorThrown + ': Error ' + jqXHR.status);
          deferred.reject('Something goes wrong!');
        }
      });

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
