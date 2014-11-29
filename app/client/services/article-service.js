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
         * @param {Function} successCallback Callback function for the success case
         * @param {Function} errorCallback Callback function for the error case
         */
        var submitArticle = function(articleObject, successCallback, errorCallback) {
            var data = JSON.stringify(articleObject);
            var url = '/api/articles';
            $http
                .post(url, data,
                    {
                        headers: { 'Content-Type': GLOBAL_JSON_TYPE},
                        timeout: GLOBAL_TIMEOUT}
                )
                .success( successCallback )
                .error( errorCallback );
        };

        /**
         * This function submits a comment
         * @param {String} apiUrl URL of the backend to submit the article
         * @param {Object} commentObject A comments object to be submitted
         * @param {Function} successCallback Handler for success case
         * @param {Function} errorCallback Handler for the error case
         */
        var submitComment = function(apiUrl, commentObject, successCallback, errorCallback) {
            var data = JSON.stringify(commentObject);
            $http
                .post(apiUrl, data,
                {
                    headers: {'Content-Type': GLOBAL_JSON_TYPE},
                    timeout: GLOBAL_TIMEOUT
                }
            )
            .success( successCallback )
            .error( errorCallback );
        };

        /**
         * This function calls the http delete method on the backend with the given apiUrl
         * @param apiUrl
         * @param successCallback
         * @param errorCallback
         */
        var deleteEntity = function(apiUrl, successCallback, errorCallback) {
            $http(
                {
                    method: 'DELETE',
                    url: apiUrl,
                    timeout: GLOBAL_TIMEOUT
                })
                .success(successCallback)
                .error(errorCallback)
        };

        var loadComments = function(apiUrl, successCallback, errorCallback) {
            $http.get(apiUrl,
                { headers: {'Content-Type': GLOBAL_JSON_TYPE},
                  timeout: GLOBAL_TIMEOUT}
            )
                .success( successCallback )
                .error( errorCallback );
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

