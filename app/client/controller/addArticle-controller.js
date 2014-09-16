/**
 * Created by aho on 16.09.2014.
 */


var addArticleController = angular.module('addArticleController', ['articleServices']);

addArticleController.controller('addArticle', ['$scope', 'articleServices',
    function ($scope,  articleServices) {
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