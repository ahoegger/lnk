/**
 * Controller for adding articles
 * @class angular_controller.moduleArticleAdd
 * @memberOf angular_controller
 * @author Andy Hoegger
 * @since 16.09.2014
 */
var moduleArticleAdd = angular.module('moduleArticleAdd', ['service.article', 'service.behaviour', 'service.authentication']);

/**
 * @description Directive for handling image loading
 * @function imageonload
 * @memberOf angular_controller.moduleArticleAdd
 */
moduleArticleAdd.directive('imageonload',
    function () {
        return {
            restrict: 'A',
            link: function (scope, element) {
                element.bind('load', function () {
                    scope.$apply(function () {
                        scope.urlIsImage = true;
                    });
                });
                element.bind('error', function () {
                    scope.$apply(function () {
                        scope.urlIsImage = false;
                    });
                });
            }
        };
    });

/**
 * @name moduleArticleAdd
 * @description Controller for handling article additions
 * @function
 * @memberOf angular_controller.AddArticleModule
 */
moduleArticleAdd.controller('controllerArticleAdd', ['$scope', '$location', 'articleService', 'behaviour', 'authenticationState','toaster',

    function ($scope, $location, articleService, behaviour, authenticationState, toaster) {

        /**
         * This function converts a string with tags (separated by commas) into an array of (trimmed) strings
         * @param tagString {String} A string with comma separated tags
         * @param separator {String} The separator character
         * @return {String[]}
         */
        var _tagStringToArray = function (tagString, separator) {
            var plainTags = [],
                trimmedTags = [];
            if (tagString && $.trim(tagString).length > 0) {
                plainTags = tagString.split(separator);
                $.each(plainTags, function (indexInArray, element) {
                    trimmedTags.push($.trim(element));
                });
                return trimmedTags;
            }
        };

        var _genericHttpCallbackFactory = function (message) {
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
        var getImageUrlInternal = function () {
            if ($scope.article.alternateImageUrl) {
                return $scope.article.alternateImageUrl;
            } else if ($scope.article.url) {
                return $scope.article.url;
            }
            return undefined;
        };

        var onPostArticleSuccess = function () {
            console.log('successful posted article.');
            $location.path('/articles')
        };

        var onPostArticleError = function (data) {
            toaster.pop('error', "Article", data);
        };

        $scope.postArticle = function ($event, $form) {
            $event.preventDefault();
            // create a empty dto
            var articleDto = {};
            if ($form.$valid) {
                // fill the dto with scope data
                articleDto.title = $scope.article.title;
                articleDto.url = $scope.article.url;
                articleDto.description = $scope.article.description;
                articleDto.imageUrl = getImageUrlInternal();
                articleDto.tags = _tagStringToArray($scope.article.tags, ',');
                articleDto.submittedOn = new Date();
                articleDto.submittedBy = authenticationState.getUser().id;

                // call article service
                articleService.submitArticle(articleDto)
                    .success(onPostArticleSuccess)
                    .error(onPostArticleError);
            }
        };

        $scope.urlIsImage = false;

        $scope.handleImgUrlError = function () {
            console.log('error during loading img');
        };
        // the ability to auto resize the description textarea vertically.
        $scope.autoResizeTextarea = behaviour.autoResizeTextarea;


        $scope.isAternateUrlVisible = function () {
            if ($scope.urlIsImage && !$scope.article.alternateImageUrl) {
                return false;
            } else {
                return true;
            }
        };

    }
]);

/**
 * @description Filter for choosing the right URL for images
 * @function imageUrlFilter
 * @memberOf angular_controller.AddArticleModule
 */
moduleArticleAdd.filter('imageUrlFilter', function () {
    return function (url, alternateUrl) {
        if (alternateUrl && alternateUrl.$viewValue) {
            return alternateUrl.$viewValue;
        } else {
            return url.$viewValue;
        }

    };
});