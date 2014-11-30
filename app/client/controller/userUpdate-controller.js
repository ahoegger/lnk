/**
 * Module for handling updating users
 * @class angular_controller.UserUpdateModule
 * @memberOf angular_controller
 * @author Andy Hoegger
 * @since 12.11.2014
 */
var userUpdateController = angular.module('userUpdateController', [ 'service.authentication', 'service.user']);

/**
 * @name userCreateController
 * @description Controller for updating users
 * @function
 * @memberOf angular_controller.UserUpdateModule
 */
userUpdateController.controller('userUpdateController', ['$scope', '$location', '$routeParams', 'authenticationState', 'userService','toaster',
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



