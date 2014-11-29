/**
 * Service for authentication
 * @class angular_services.AuthenticationServiceModule
 * @memberOf angular_services
 * @author Andy Hoegger
 * @since 06.11.2014
 */
var authenticationService = angular.module('service.authentication', ['service.user']);

/**
 * @description Service factory for authentication
 * @function AuthenticationService
 * @memberOf angular_services.AuthenticationServiceModule
 */
authenticationService.factory('authenticationService', ['$http', '$window', 'authenticationState',
    function ($http, $window, authenticationState) {
        var GLOBAL_TIMEOUT = 5000;
        var GLOBAL_JSON_TYPE = 'application/json';

        var userInternal = undefined;
        var loginInternal = function(username, password){
            console.log('userService:login with user:' + username + '.');
            var data = JSON.stringify({
                "userName": username,
                "password": password
            });
            return $http.post('/api/authentication', data,
                {
                    headers: {'Content-Type': GLOBAL_JSON_TYPE},
                    timeout: GLOBAL_TIMEOUT
                }
            ).success(loginSuccessFunction);
        };
        var loginSuccessFunction = function (data) {
            authenticationState.setAuthentication(data.user, data.token);
        };
        var logoutInternal = function(){
            authenticationState.setAuthentication(undefined, undefined);
        };
        return {
            logIn: loginInternal,
            logOut: logoutInternal
        }
    }]);

/**
 * @description Service factory for authentication sate
 * @function AuthenticationState
 * @memberOf angular_services.AuthenticationServiceModule
 */
authenticationService.factory('authenticationState', [ '$window',
    function ($window) {
        var internalUser = undefined;
        var setAuthenticationInternal = function (user, token) {
            setUserInternal(user);
            if(token == undefined){
                delete $window.sessionStorage.token;
            }else{
                $window.sessionStorage.token = token;
            }
        };



        var getUserTokenInternal = function () {
            return $window.sessionStorage.token;
        };

        var setUserInternal = function(user){
            if(user == undefined){
                delete $window.sessionStorage.user;
                internalUser = undefined;
            }else{
                $window.sessionStorage.user = JSON.stringify(user);
                internalUser = user;
            }
        };
        var getUserInternal = function () {
            return internalUser;
        };
        // try to read user from session store
        var userString = $window.sessionStorage.user;
        if(userString != undefined){
            internalUser = JSON.parse(userString);
        }else{
            internalUser = undefined;
        }

        return {
            getUser: getUserInternal,
            setUser: setUserInternal,
            getUserToken: getUserTokenInternal,
            setAuthentication: setAuthenticationInternal
        };
    }]);