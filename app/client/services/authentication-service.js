/**
 * Created by aho on 06.11.2014.
 */
var authenticationService = angular.module('service.authentication', ['service.user']);


authenticationService.factory('authenticationService', ['$http', '$window', 'authenticationState',
    function ($http, $window, authenticationState) {
        var userInternal = undefined;
        var loginSuccessFunction = function (data, loginSuccessCallback) {
            console.log('successful logged in...');
            authenticationState.setAuthentication(data.user, data.token);
            loginSuccessCallback();
        };
        var loginErrorFunction = function (data, loginErrorCallback) {
            console.log(status);
            console.log(data);
            if (loginErrorCallback) {
                loginErrorCallback();
            }
        };
        return {
            logIn: function (username, password, successCallback, errorCallback) {
                console.log('userService:login with user:' + username + ' and password:' + password)
                console.log('loginController: user:' + username);
                if (username !== undefined && password !== undefined) {
                    var data = JSON.stringify({
                        "userName": username,
                        "password": password
                    });
                    $http.post('/api/authentication', data,
                        { headers: {'Content-Type': 'application/json'} }
                    ).success(function (data) {
                            loginSuccessFunction(data, successCallback)
                        })
                        .error(function (data, status, headers, config) {
                            if (status === 302) {
                                loginSuccessFunction(data, successCallback);
                            } else {
                                loginErrorFunction(data, errorCallback)
                            }
                        });
                } else if (errorCallback) {

                    errorCallback();
                }
            },

            logOut: function (successCallback) {
                authenticationState.setAuthentication(undefined, undefined);
                if (successCallback) {
                    successCallback();
                }
            }
        }
    }]);

authenticationService.factory('authenticationState', [ '$window',
    function ($window) {
        var internalUser = undefined;
        var setAuthenticationInternal = function (user, token) {
            if(user == undefined){
                delete $window.sessionStorage.user;
                internalUser = undefined;
            }else{
                $window.sessionStorage.user = JSON.stringify(user);
                internalUser = user;
            }
            if(token == undefined){
                delete $window.sessionStorage.token;
            }else{
                $window.sessionStorage.token = token;
            }
        };

        var getUserTokenInternal = function () {
            return $window.sessionStorage.token;
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
            getUserToken: getUserTokenInternal,
            setAuthentication: setAuthenticationInternal
        };
    }]);