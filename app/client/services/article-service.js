/**
 * Created by aho on 15.09.2014.
 */

var articleServices = angular.module('service.article', []);

articleServices.factory('articleService', ['$http',
    function ($http) {
        var doVote = function(url, successCallback, errorCallback) {
            return $http.post(
                url,
                null
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
            return $http({method: 'GET', url: url}).
                error(function (data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    console.log('An error during data access')
                });
        };
        var get = function (searchQuery) {
            return doRequest(searchQuery);
        };

        var voteUp = doVote;

        var voteDown = doVote;

        /**
         * This function submit a form with the given ID
         * @param {Object} articleObject The article object containing it's data
         */
        var submitArticle = function(articleObject, successCallback, errorCallback) {
            var data = JSON.stringify(articleObject);
            var url = '/api/articles';
            $http
                .post(url, data,
                    { headers: { 'Content-Type': 'application/json'} }
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
                { headers: {'Content-Type': 'application/json'} }
            )
            .success( successCallback )
            .error( errorCallback );
        };

        /**
         * This function calls the http delete method an the backend with the given apiUrl
         * @param apiUrl
         * @param successCallback
         * @param errorCallback
         */
        var deleteArticle = function(apiUrl, successCallback, errorCallback) {
            $http({method: 'DELETE', url: apiUrl})
                .success(successCallback)
                .error(errorCallback)
        };

        return {
            getArticles: get,
            voteUp: voteUp,
            voteDown: voteDown,
            submitArticle: submitArticle,
            submitComment: submitComment,
            deleteArticle: deleteArticle
        };
    }]);

