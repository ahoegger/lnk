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
            var data = JSON.stringify({
                "userName": username,
                "password": password
            });
            return $http.post('/api/authentication', data,
                { headers: {'Content-Type': 'application/json'} }
            );
        },

        logOut: function() {

        }
    }
}]);

