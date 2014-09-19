/**
 * Created by aho on 16.09.2014.
 */


var addArticleController = angular.module('addArticleController', ['service.article', 'service.behaviour']);

addArticleController.directive('imageonload',
    function ( ) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                element.bind('load', function () {
                    scope.$apply(function(){
                   scope.urlIsImage = true;
                });
                });
                element.bind('error',function () {
                    scope.$apply(function(){
                        scope.urlIsImage = false;
                    });
                });
            }
        };
    });


addArticleController.controller('addArticle', ['$scope', '$location', 'article', 'behaviour',


    function ($scope, $location, article, behaviour) {
        $scope.postArticle = function ($event, $form) {
            $event.preventDefault();
            if ($form.$valid) {
                console.dir($scope.article);
                $location.path('/articles');
            }
        };

        $scope.urlIsImage = false;

        $scope.handleImgUrlError = function () {
            console.log('error during loading img');
        };
        // the ability to auto resize the description textarea vertically.
        $scope.autoResizeTextarea = behaviour.autoResizeTextarea;



        $scope.isAternateUrlVisible = function(){
            if($scope.urlIsImage && !$scope.article.alternateImageUrl){
                return false;
            }else{
                return true;
            }
        };
    }
]);


addArticleController.filter('imageUrlFilter', function() {
    return function(url,  alternateUrl, isValidImage) {
        if(alternateUrl && alternateUrl.$viewValue){
            return alternateUrl.$viewValue;
        }else{
            return url.$viewValue;
        }

    };
});
