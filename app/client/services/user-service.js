/**
 * Created by aho on 12.11.2014.
 */
var userService = angular.module('service.user', []);


userService.factory('userService',['$http',
    function($http) {

    var getUserInternal = function(id){

        return $http({method: 'GET', url: '/api/user/' + id}).
            error(function (data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                console.log('An error during data access')
            });
    };

    var updateUserInternal = function(user){
        return $http({
                method: 'PUT',
                url: '/api/user/' + user.id,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify(user)
            })
            .error(function (data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                console.log('An error during data access')
            });
    };

    return{
        getUser : getUserInternal,
        updateUser : updateUserInternal
    };
}]);

userService.factory('userServiceState',function() {
    var auth = {
        user : undefined
    };

    return auth;
});