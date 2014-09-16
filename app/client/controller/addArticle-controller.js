/**
 * Created by aho on 16.09.2014.
 */


var addArticleController = angular.module('addArticleController', ['service.article']);

addArticleController.controller('addArticle', ['$scope','$location', 'article',
    function ($scope,   $location, article) {
        $scope.postArticle = function($event){
            $event.preventDefault();
            console.dir($scope.newArticle);
            console.dir($location);
            $location.path('/articles');
        };
//        articleServices.getArticles().success(function(data, status, headers, config) {
//            $scope.articles = data;
//            console.log('success with get articles!');
//        });
//        $scope.voteUp = function($event, articleId){
//            $event.preventDefault();
//            articleServices.voteUp(articleId);
//        }
//        $scope.voteDown = function($event, articleId){
//            $event.preventDefault();
//            articleServices.voteDown(articleId);
//        }
    }
]);

var addArticleControllerFun = function($scope, articleServices){
    $scope.postArticle = function($event){
        $event.preventDefault();
        console.dir($scope.newArticle);
    }
}