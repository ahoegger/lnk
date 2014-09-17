/**
 * Created by aho on 16.09.2014.
 */


var addArticleController = angular.module('addArticleController', ['service.article', 'service.behaviour']);

addArticleController.directive('myImage', [ '$timeout',
    function ( $timeout) {
        return function (scope, elm, attrs) {
            elm.on('error', function () {
                scope.$apply(function(){
                    scope.urlIsImage = false;
                });
                console.log('error during loading '+scope.submitArticle.url);
            });
            elm.on('load', function () {
                scope.$apply(function(){
                   scope.urlIsImage = true;
                });
                console.log('img loaded '+scope.submitArticle.url);
            });
        };
    }]);

addArticleController.directive

addArticleController.controller('addArticle', ['$scope', '$location', 'article', 'behaviour',
    function ($scope, $location, article, behaviour) {
        $scope.postArticle = function ($event, $form) {
            $event.preventDefault();
            if ($form.$valid) {
                console.dir($scope.submitArticle);
                $location.path('/articles');
            }
        };

        $scope.urlIsImage = false;
        $scope.sayHello = function () {
            console.log('say hello...');
        }
        $scope.handleImgUrlError = function () {
            console.log('error during loading img');
        };
        // the ability to auto resize the description textarea vertically.
        $scope.autoResizeTextarea = behaviour.autoResizeTextarea;


        $scope.computeImageUrl = function(){
            if($scope.submitArticle.alternateImageUrl != null){
                console.log('use alternate url');
                return $scope.submitArticle.alternateImageUrl;
            }else{
                console.log('use default url');
                return $scope.submitArticle.url;
            }
        };

        $scope.isAternateUrlVisible = function(){
            if($scope.urlIsImage && !$scope.submitArticle.alternateImageUrl){
                return false;
            }else{
                return true;
            }
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

