/**
 * Service for article functionality
 * @class angular_services.ArticleServiceModule
 * @memberOf angular_services
 * @author Andy Hoegger
 * @since 15.09.2014
 */
var articleServices = angular.module('service.article', []);

/**
 * @description Service factory for interaction with the backend with regards to articles, comments, etc.
 * @function ArticleService
 * @memberOf angular_services.ArticleServiceModule
 */
articleServices.factory('articleService', ['$http',
    function ($http) {
        var GLOBAL_TIMEOUT = 5000;
        var GLOBAL_JSON_TYPE = 'application/json';
        var doVote = function(url, successCallback, errorCallback) {
            return $http.post(
                url,
                null,
                {
                    headers: {'Content-Type': GLOBAL_JSON_TYPE},
                    timeout: GLOBAL_TIMEOUT
                }
            )
            .success( successCallback )
            .error( errorCallback );
        };

        var doRequest = function (searchQuery) {
            var url = '/api/articles';
            if(searchQuery){
                url += '?anywhere='+searchQuery;
            }
            console.log(url);
            return $http.get(url,
                    {
                        headers: {'Accept': GLOBAL_JSON_TYPE},
                        timeout: GLOBAL_TIMEOUT
                    }
                )
                .error(function (data) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    console.log('An error during data access')
                });
        };
        var get = function (searchQuery) {
            return doRequest(searchQuery);
        };

        var getArticlesByApi = function(apiUrl, successHandler, errorHandler) {
            $http.get(apiUrl,
                { headers: {'Accept': GLOBAL_JSON_TYPE},
                  timeout: GLOBAL_TIMEOUT
                })
                .success(successHandler)
                .error(errorHandler)
        };

        var voteUp = doVote;

        var voteDown = doVote;

        /**
         * This function submit a form with the given ID
         * @param {Object} articleObject The article object containing it's data
         */
        var submitArticle = function(articleObject) {
            var data = JSON.stringify(articleObject);
            var url = '/api/articles';
            return $http.post(url, data,
                    {
                        headers: { 'Content-Type': GLOBAL_JSON_TYPE},
                        timeout: GLOBAL_TIMEOUT
                    }
                );
        };

        /**
         * This function submits a comment
         * @param {String} apiUrl URL of the backend to submit the article
         * @param {Object} commentObject A comments object to be submitted
         */
        var submitComment = function(apiUrl, commentObject) {
            var data = JSON.stringify(commentObject);
            return $http
                .post(apiUrl, data,
                {
                    headers: {'Content-Type': GLOBAL_JSON_TYPE},
                    timeout: GLOBAL_TIMEOUT
                }
            );
        };

        /**
         * This function calls the http delete method on the backend with the given apiUrl
         * @param apiUrl
         */
        var deleteEntity = function(apiUrl) {
            return $http(
                {
                    method: 'DELETE',
                    url: apiUrl,
                    timeout: GLOBAL_TIMEOUT
                })
        };

        var loadComments = function(apiUrl) {
            return $http.get(apiUrl,
                { headers: {'Content-Type': GLOBAL_JSON_TYPE},
                  timeout: GLOBAL_TIMEOUT}
            );
        };

        return {
            getArticles: get,
            getArticlesByApi: getArticlesByApi,
            voteUp: voteUp,
            voteDown: voteDown,
            submitArticle: submitArticle,
            submitComment: submitComment,
            deleteArticle: deleteEntity,
            deleteComment: deleteEntity,
            loadComments: loadComments
        };
    }]);

