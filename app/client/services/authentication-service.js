/**
 * Created by aho on 06.11.2014.
 */
var authenticationService = angular.module('service.authentication', []);


authenticationService.factory('AuthenticationService', function() {
    var auth = {
        isLogged: false
    }

    return auth;
});

authenticationService.factory('UserService', ['$http',function($http) {
    return {
        logIn: function(username, password) {
            console.log('userService:login with user:'+username+' and password:'+password)
            return {
                success: function (onSuccess) {
                    return {
                        error: function(onError) {
                        }
                    }
                }
            };
//            return $http.post(options.api.base_url + '/login', {username: username, password: password});
        },

        logOut: function() {

        }
    }
}]);

