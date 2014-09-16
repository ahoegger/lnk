/**
 * Created by aho on 16.09.2014.
 */


var addArticleController = angular.module('addArticleController', ['service.article', 'service.behaviour']);

addArticleController.controller('addArticle', ['$scope', '$location', 'article','behaviour',
    function ($scope, $location, article, behaviour) {
        $scope.postArticle = function ($event, $form) {
            $event.preventDefault();
            if ($form.$valid) {
                console.dir($scope.newArticle);
                $location.path('/articles');
            }
        };

        $scope.autoResizeTextarea = behaviour.autoResizeTextarea;
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

