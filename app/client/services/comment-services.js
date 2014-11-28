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
        var doRequest = function () {
            return $http({method: 'GET', url: '/api/articles'}).
                error(function (data, status, headers, config) {
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

