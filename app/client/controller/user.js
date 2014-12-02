/**
 * Module for handling the creation of users
 * @class angular_controller.moduleUser
 * @memberOf angular_controller
 * @author Andy Hoegger
 * @since 12.11.2014
 */
var moduleUser = angular.module('moduleUser', [ 'service.authentication', 'service.user', 'service.authentication']);


/**
 * @name controllerUserUpdate
 * @description Controller for the creation of users
 * @function
 * @memberOf angular_controller.moduleUser
 */
moduleUser.controller('controllerUserCreate', ['$scope', '$location', '$routeParams', 'authenticationState', 'userService', 'authenticationService', 'toaster',
    function ($scope, $location, $routeParams, authenticationState, userService, authenticationService, toaster) {

        var successfulStored = function (data) {
            console.log('User ' + $scope.user.userName + ' successfully created!');
            authenticationService.logIn($scope.user.userName, $scope.user.password)
                .success(loginSuccess);
        };

        var loginSuccess = function (data) {
            $location.path("/articles");
            toaster.pop('success', "Login", "User " + data.userName + " logged in successfully.", 1500);
        };


        // used because the userUpdate.html is used twice for create and update
        $scope.usernameReadOnly = false;
        $scope.user = undefined;

        $scope.storeUser = function ($event) {
            $event.preventDefault();
            var userVar = {
                userName: $scope.user.userName,
                name: $scope.user.name,
                firstname: $scope.user.firstname,
                password: $scope.user.password
            };
            userService.createUser(userVar)
                .success(successfulStored)
                .error(function () {
                    toaster.pop('error', "User", data);
                });
        }

    }

]);


/**
 * @name controllerUserCreate
 * @description Controller for updating users
 * @function
 * @memberOf angular_controller.moduleUser
 */
moduleUser.controller('controllerUserUpdate', ['$scope', '$location', '$routeParams', 'authenticationState', 'userService','toaster',
    function ($scope, $location, $routeParams, authenticationState, userService,toaster) {


        // have a copy of the user to ensure passwords are not bind. the password is anyway only a hash.
        var updateScopeUserInternal = function (user) {
            $scope.user =
            {
                id: user.id,
                userName: user.userName,
                name: user.name,
                firstname: user.firstname,
                active: true,
                password: undefined,
                password_verify: undefined
            };
        };

        var storeUserInternal = function ($event) {
            $event.preventDefault();
            var userVar = {
                id: $scope.user.id,
                userName: $scope.user.userName,
                name: $scope.user.name,
                firstname: $scope.user.firstname,
                password: $scope.user.password,
                active: $scope.user.active
            };
            userService.storeUser(userVar)
                .success(successfulStored)
                .error(function(data){
                    toaster.pop('error', "User", data);
                });
        };
        var successfulStored = function (data) {
            updateScopeUserInternal(data);
            authenticationState.setUser(data);
            $location.path('/articles');
        };

        // used because the userUpdate.html is used twice for create and update
        $scope.usernameReadOnly = true;
        $scope.user = undefined;

        $scope.storeUser = storeUserInternal;
        updateScopeUserInternal(authenticationState.getUser());


    }
]);


