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
loginController.controller('loginController', ['$scope','$location', '$window','authenticationService','toaster',
    function ($scope, $location, $window, authenticationService,toaster) {

        $scope.$on('$viewContentLoaded', function(){
            var x = window.scrollX, y = window.scrollY;
            $("input[autofocus]:not([ng-readonly=true])").first().focus();
            window.scrollTo(x, y);
        });

        var loginSuccess = function(data) {
            toaster.pop('success', "Login", "User "+data.user.userName+" logged in successfully.",1500);
            $location.path("/");
        };
        var onLoginError = function(data, status, headers, config){
            toaster.pop('error', "Login", data);
        };

        var logoutSuccess = function() {
            $location.path("/");
        };

        $scope.login = function logIn($event) {
            $event.preventDefault();
            var username = $scope.login.username;
            var password = $scope.login.password;
            authenticationService.logIn(username, password).success(loginSuccess).error(onLoginError);
        };

        $scope.logout = function logout(logoutSuccess) {
                authenticationService.logOut();
        };
        $scope.createAccount = function(){
            $location.path("/user/create");
        };

    }]);