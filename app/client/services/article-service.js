/**
 * Created by aho on 15.09.2014.
 */

var articleServices = angular.module('service.article', []);

articleServices.factory('article', ['$http',
    function ($http) {
        var doRequest = function () {
            return $http({method: 'GET', url: '/api/articles'}).
                error(function (data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    console.log('An error during data access')
                });
        };
        var get = function () {
            return doRequest();
        };

        var voteUp = function (articleId) {
            console.log('remote call [voteUp : ' + articleId + ']');
        };

        var voteDown = function (articleId) {
            console.log('remote call [voteDown : ' + articleId + ']');
        };

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

        return {
            getArticles: get,
            voteUp: voteUp,
            voteDown: voteDown,
            submitArticle: submitArticle
        };
    }]);

