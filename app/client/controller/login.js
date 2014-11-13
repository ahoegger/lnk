var loginController = angular.module('loginController', [ 'service.authentication']);

loginController.controller('loginController', ['$scope','$location', '$window','authenticationService',
    function ($scope, $location, $window, authenticationService) {

        $scope.$on('$viewContentLoaded', function(){
            console.log("activate login");
            $("input[autofocus]").first().focus();
        });
//        $scope.login = function ($event, $form) {
//            authenticationService.logIn($scope.login.username,$scope.login.password);
//            $event.preventDefault();
//        };

        var loginSuccess = function() {
            $location.path("/");
        };

        var logoutSuccess = function() {
            $location.path("/");
        };

        $scope.login = function logIn(username, password) {
            username = $scope.login.username;
            password = $scope.login.password;
            authenticationService.logIn(username, password,loginSuccess);
        };

        $scope.logout = function logout(logoutSuccess) {
                authenticationService.logOut();
        };
        $scope.createAccount = function(){
            $location.path("/user/create");
        };

    }]);