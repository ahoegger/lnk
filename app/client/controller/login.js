var loginController = angular.module('loginController', [ 'service.authentication']);

loginController.controller('loginController', ['$scope', 'UserService','AuthenticationService',
    function ($scope, UserService, AuthenticationService) {

        $scope.login = function ($event, $form) {

            UserService.logIn($scope.login.username,$scope.login.password);
            $event.preventDefault();
        };

        var loginSucess = function(data) {
            AuthenticationService.isLogged = true;
            $window.sessionStorage.token = data.token;
            $location.path("/admin");
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
                UserService.logIn(username, password).success(loginSucess).error(loginError);
            }
        }


//        login.getArticles().success(function(data, status, headers, config) {
//            $scope.articles = data;
//            console.log('success with get articles!');
//        });
//        $scope.voteUp = function($event, articleId){
//            $event.preventDefault();
//            // TODO Implement colling voteUp API call
//            article.voteUp(articleId);
//        };
//        $scope.voteDown = function($event, articleId){
//            $event.preventDefault();
//            // TODO Implement colling voteDown API call
//            article.voteDown(articleId);
//        }
    }]);