/**
 * Created by aho on 12.09.2014.
 */
    var articlesController = angular.module('articlesController', ['articleServices']);

    articlesController.controller('articleListController', ['$scope', 'articleServices',
        function ($scope,  articleServices) {
            articleServices.getArticles().success(function(data, status, headers, config) {
                $scope.articles = data;
                console.log('success with get articles!');
            });
            $scope.voteUp = function($event, articleId){
                $event.preventDefault();
                articleServices.voteUp(articleId);
            }
            $scope.voteDown = function($event, articleId){
                $event.preventDefault();
                articleServices.voteDown(articleId);
            }
        }]);

/**
 * a filter to format the submitted date into a relative date from now like 'few seconds ago'
 */
articlesController.filter('dateFromNow', function() {
    return function(input, $moment) {
        return moment(input).fromNow();
    };
});


//articlesController.controller('navigationController', ['$scope',
//    function ($scope) {
//
//        $scope.sloagan2='navigation Sloagan';
//    }]);
