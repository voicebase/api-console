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

    var getTokens = function(credentials, parameters) {
      var deferred = $q.defer();

      var username = credentials.username;
      var password = credentials.password;
      var apis = parameters.apis[0];
      var version = parameters.version[0];

      jQuery.ajax({
        url: 'https://' + apis + '.voicebase.com/' + version + '/access/users/' + username + '/tokens',
        type: 'GET',
        dataType: 'json',
        beforeSend: function(xhr) {
          xhr.setRequestHeader('Authorization', 'Basic ' + btoa(username + ':' + password));
        },
        success: function(tokens){
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
