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

        /**
         * This function converts a string with tags (separated by commas) into an array of (trimmed) strings
         * @param tagString {String} A string with comma separated tags
         * @param separator {String} The separator character
         * @return {String[]}
         */
        var _tagStringToArray = function(tagString, separator) {
            var plainTags = [],
                trimmedTags = [];
            if (tagString && $.trim(tagString).length > 0) {
                plainTags = tagString.split(separator);
                $.each(plainTags, function(indexInArray, element) {
                    trimmedTags.push($.trim(element));
                });
                return trimmedTags;
            }
        }

        var _genericHttpCallbackFactory = function(message) {
            var self = {
                message: message
            };
            return function (data, status, headers, config) {
                console.log('HTTP Callback: ' + self.message);
                console.log('Data is:');
                console.dir(data);
                console.log('Status = ' + status);
                console.log('Headers is:');
                console.dir(headers);
                console.log('Config is:');
                console.dir(config);
            };
        };

        $scope.postArticle = function ($event, $form) {
            var articleDto = {};
            $event.preventDefault();
            if ($form.$valid) {
                articleDto.title = $scope.article.title;
                articleDto.url = $scope.article.url;
                articleDto.description = $scope.article.description;
                articleDto.alternateImageUrl = $scope.article.alternateImageUrl;
                articleDto.tags = _tagStringToArray($scope.article.tags, ',');
                articleDto.submittedOn = new Date();
                articleDto.submittedBy = 'DUMMY';

                console.dir(articleDto);
                article.submitArticle(articleDto,
                    _genericHttpCallbackFactory('Article submit success callback'),
                    _genericHttpCallbackFactory('Article submit error callback'));
            }
            // TODO Clear form after submitting
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