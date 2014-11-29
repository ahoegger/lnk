/**
 * Service for user handling
 * @class angular_services.UserServiceModule
 * @memberOf angular_services
 * @author Andy Hoegger
 * @since 12.11.2014
 */
var userService = angular.module('service.user', []);

/**
 * @description Service factory for user service
 * @function UserService
 * @memberOf angular_services.UserServiceModule
 */
userService.factory('userService', ['$http',
    function ($http) {

        var GLOBAL_TIMEOUT = 5000;
        var GLOBAL_JSON_TYPE = 'application/json';

        var getUserInternal = function (id) {
            console.log('getUserInternal with id \'' + id + '\'.');
            return $http.get('/api/user/' + id,
                {
                    headers: { 'Content-Type': GLOBAL_JSON_TYPE },
                    timeout: GLOBAL_TIMEOUT
                })
                .error(function (data) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    console.log('An error during data access')
                });
        };

        var updateUserInternal = function (user) {
            return $http.put('/api/user/' + user.id,
                JSON.stringify(user),
                {
                    headers: { 'Content-Type': GLOBAL_JSON_TYPE },
                    timeout: GLOBAL_TIMEOUT
                })
                .error(function (data) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    console.log('An error during data access')
                });
        };

        var findUserByUsernameInternal= function(userName){
//            /api/user?username=xxx
            return $http({method: 'GET',
                url: '/api/users?username=' + userName,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        };

        var createUserInternal = function (user) {
            return $http.post('/api/users',
                JSON.stringify(user),
                {
                    headers: { 'Content-Type': GLOBAL_JSON_TYPE },
                    timeout: GLOBAL_TIMEOUT
                })
                .error(function (data) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    console.log('An error during data access')
                });
        };



        return{
            getUser: getUserInternal,
            findUserByUsername: findUserByUsernameInternal,
            storeUser: updateUserInternal,
            createUser: createUserInternal
        };
    }]);

