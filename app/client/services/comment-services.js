/**
 * Service for comments
 * @class angular_services.CommentsServiceModule
 * @memberOf angular_services
 * @author Andy Hoegger
 * @since 15.09.2014
 */
var articleServices = angular.module('commentServiceModule', []);

/**
 * @description Service factory for comment services
 * @function CommentService
 * @memberOf angular_services.CommentsServiceModule
 */
articleServices.factory('commentsService', ['$http',
    function ($http) {
        var GLOBAL_TIMEOUT = 5000;
        var GLOBAL_JSON_TYPE = 'application/json';

        var doRequest = function () {
            return $http.get('/api/articles',
                {
                    headers: {'Content-Type': GLOBAL_JSON_TYPE},
                    timeout: GLOBAL_TIMEOUT
                }).
                error(function (data) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    console.log('An error during data access')
                });
        };

        return {
            getArticles: function () {
                return doRequest();
            },
            voteUp: function (articleId) {
                console.log('remote call [voteUp : ' + articleId + ']');
            },
            voteDown: function (articleId) {
                console.log('remote call [voteDown : ' + articleId + ']');
            }
        };
    }]);

