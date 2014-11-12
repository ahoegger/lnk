var loginController = angular.module('loginController', [ 'service.authentication']);

loginController.controller('loginController', ['$scope','$location','$window', 'UserService','AuthenticationService',
    function ($scope, $location, $window, UserService, AuthenticationService) {

//        $scope.login = function ($event, $form) {
//            UserService.logIn($scope.login.username,$scope.login.password);
//            $event.preventDefault();
//        };

        var loginSuccess = function() {
            $location.path("/");
        };

        var logoutSuccess = function() {
            $location.path("/");
        }

        $scope.login = function logIn(username, password) {
            username = $scope.login.username;
            password = $scope.login.password
            UserService.logIn(username, password,loginSuccess);
        }

        $scope.logout = function logout(logoutSuccess) {
                UserService.logOut();
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