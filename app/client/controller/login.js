/**
 * Module for handling Login stuff
 * @class angular_controller.LoginModule
 * @memberOf angular_controller
 * @author Andy Hoegger
 * @since 06.11.2014
 */
var loginController = angular.module('loginController', [ 'service.authentication']);

/**
 * @name loginController
 * @description Controller for Login stuff
 * @function
 * @memberOf angular_controller.LoginModule
 */
loginController.controller('loginController', ['$scope', '$location', '$window', '$timeout', 'authenticationService', 'toaster',
    function ($scope, $location, $window, $timeout, authenticationService, toaster) {

        var loginSuccess = function (data) {
            toaster.pop('success', "Login", "User " + data.user.userName + " logged in successfully.", 1500);
            // ensure the articles route is active
            $location.path("/articles");
        };
        var onLoginError = function (data, status, headers, config) {
            toaster.pop('error', "Login", data);
        };

        var logoutSuccess = function () {
            toaster.pop('success', "Login", "Successfully logged out.", 1500);
            // ensure the articles route is active
            $location.path("/articles");
        };

        $scope.login = function logIn($event) {
            $event.preventDefault();
            var username = $scope.login.username;
            var password = $scope.login.password;
            // call the authentication service
            authenticationService.logIn(username, password).success(loginSuccess).error(onLoginError);
        };

        $scope.logout = function logout(logoutSuccess) {
            authenticationService.logOut();
        };
        $scope.createAccount = function ($event) {
            $event.preventDefault();
            // ensure the user create route is active
            $location.path("/user/create");
        };

    }]);