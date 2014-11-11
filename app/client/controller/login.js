var loginController = angular.module('loginController', [ 'service.authentication']);

loginController.controller('loginController', ['$scope','$location','$window', 'UserService','AuthenticationService',
    function ($scope, $location, $window, UserService, AuthenticationService) {

        $scope.login = function ($event, $form) {

            UserService.logIn($scope.login.username,$scope.login.password);
            $event.preventDefault();
        };

        var loginSuccess = function(data) {
            console.log('successful logged in...');
            AuthenticationService.isLogged = true;
            $window.sessionStorage.token = data.token;
            $location.path("/");
        };
        var loginError = function(status, data) {
            console.log(status);
            console.log(data);
        };

        $scope.login = function logIn(username, password) {
            username = $scope.login.username;
            password = $scope.login.password
            console.log('loginController: user:'+username);
            if (username !== undefined && password !== undefined) {
                UserService.logIn(username, password).success(loginSuccess).error(loginError);
            }
        }

        $scope.logout = function logout() {
            if (AuthenticationService.isLogged) {
                AuthenticationService.isLogged = false;
                delete $window.sessionStorage.token;
                $location.path("/");
            }
        }

//        login.getArticles().success(function(data, status, headers, config) {
//            $scope.articles = data;
//            console.log('success with get articles!');
//        });
//        $scope.voteUp = function($event, articleId){
//            $event.preventDefault();
//            article.voteUp(articleId);
//        };
//        $scope.voteDown = function($event, articleId){
//            $event.preventDefault();
//            article.voteDown(articleId);
//        }
    }]);