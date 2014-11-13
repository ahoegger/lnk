/**
 * Created by aho on 12.11.2014.
 */
var userService = angular.module('service.user', []);


userService.factory('userService',['$http',
    function($http) {
    var getUserInternal = function(id){

        return $http({method: 'GET', url: '/api/user:'+id}).
            error(function (data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                console.log('An error during data access')
            });
    }

    return{
        getUser : getUserInternal
    };
}]);

userService.factory('userServiceState',function() {
    var auth = {
        user : undefined
    };

    return auth;
});