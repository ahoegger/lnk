/**
 * Module for handling Login stuff
 * @class angular_controller.moduleLogin
 * @memberOf angular_controller
 * @author Andy Hoegger
 * @since 06.11.2014
 */
var moduleLogin = angular.module('moduleLogin', [ 'service.authentication']);

/**
 * @name controllerLogin
 * @description Controller for Login stuff
 * @function
 * @memberOf angular_controller.moduleLogin
 */
moduleLogin.controller('controllerLogin', ['$scope', '$location', '$window', '$timeout', 'authenticationService', 'toaster',
    function ($scope, $location, $window, $timeout, authenticationService, toaster) {

        var loginSuccess = function (data) {
            resetAllFieldValuesInternal();
            toaster.pop('success', "Login", "User " + data.user.userName + " logged in successfully.", 1000);
            // ensure the articles route is active
            $location.path("/articles");
        };
        var onLoginError = function (data) {
            resetAllFieldValuesInternal();
            toaster.pop('error', "Login", data);
        };


        var resetAllFieldValuesInternal = function(){
          if($scope.loginData){
              $scope.loginData.username = undefined;
              $scope.loginData.password = undefined;
              $scope.loginForm.$setPristine();
          }
        };

        $scope.loginData = {
          username : undefined,
          password : undefined

        };

        $scope.login = function logIn($event) {
            $event.preventDefault();
            var username = $scope.loginData.username;
            var password = $scope.loginData.password;
            // call the authentication service
            authenticationService.logIn(username, password).success(loginSuccess).error(onLoginError);
        };

        $scope.createAccount = function ($event) {
            $event.preventDefault();
            // ensure the user create route is active
            $location.path("/user/create");
        };

    }]);