/**
 * Module for handling the creation of users
 * @class angular_controller.UserCreateModule
 * @memberOf angular_controller
 * @author Andy Hoegger
 * @since 12.11.2014
 */
var userCreateController = angular.module('userCreateController', [ 'service.authentication', 'service.user', 'service.authentication']);


/**
 * @name userCreateController
 * @description Controller for the creation of users
 * @function
 * @memberOf angular_controller.UserCreateModule
 */
userCreateController.controller('userCreateController', ['$scope', '$location', '$routeParams', 'authenticationState', 'userService', 'authenticationService', 'toaster',
    function ($scope, $location, $routeParams, authenticationState, userService, authenticationService, toaster) {

        var successfulStored = function (data) {
            console.log('User ' + $scope.user.userName + ' successfully created!');
            authenticationService.logIn($scope.user.userName, $scope.user.password)
                .success(loginSuccess);
        };

        var loginSuccess = function () {
            $location.path("/articles");
            toaster.pop('success', "Login", "User " + data.user.userName + " logged in successfully.", 1500);
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




