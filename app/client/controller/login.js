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
loginController.controller('loginController', ['$scope','$location', '$window','authenticationService',
    function ($scope, $location, $window, authenticationService) {

        $scope.$on('$viewContentLoaded', function(){
            console.log("activate login");
            $("input[autofocus]").first().focus();
        });

        var loginSuccess = function() {
            $location.path("/");
        };

        var logoutSuccess = function() {
            $location.path("/");
        };

        $scope.login = function logIn($event) {
            $event.preventDefault();
            var username = $scope.login.username;
            var password = $scope.login.password;
            authenticationService.logIn(username, password,loginSuccess);
        };

        $scope.logout = function logout(logoutSuccess) {
                authenticationService.logOut();
        };
        $scope.createAccount = function(){
            $location.path("/user/create");
        };

    }]);