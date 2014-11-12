/**
 * Created by aho on 06.11.2014.
 */
var authenticationService = angular.module('service.authentication', []);


authenticationService.factory('AuthenticationService', function() {
    var auth = {
        isLogged: false,
        user: null
    }

    return auth;
});

authenticationService.factory('UserService', ['$http', '$window', 'AuthenticationService',
    function($http,$window, AuthenticationService) {
        var loginSuccessFunction = function(data, loginSuccessCallback){
            console.log('successful logged in...');
            AuthenticationService.isLogged = true;
            AuthenticationService.user = data.user;
            console.log(AuthenticationService.user)
            $window.sessionStorage.token = data.token;
            loginSuccessCallback();
        };
        var loginErrorFunction = function(data, loginErrorCallback){
            console.log(status);
            console.log(data);
            if(loginErrorCallback) {
                loginErrorCallback();
            }
        }
    return {
        logIn: function(username, password, successCallback, errorCallback) {
            console.log('userService:login with user:'+username+' and password:'+password)
            console.log('loginController: user:'+username);
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
                    .error(function () {
                        loginErrorFunction(data, errorCallback)
                    });
            }else{
                errorCallback();
            }
        },

        logOut: function(successCallback) {
            if (AuthenticationService.isLogged) {
                AuthenticationService.isLogged = false;
                AuthenticationService.user = null;
                delete $window.sessionStorage.token;
                if(successCallback) {
                    successCallback();
                }
            }
        }
    }
}]);

