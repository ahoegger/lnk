/**
 * Created by aho on 12.09.2014.
 */
    var articlesController = angular.module('articlesController', ['service.article', 'service.behaviour']);

    articlesController.controller('articleListController', ['$scope', 'article', 'behaviour',
        function ($scope,  article, behaviour) {
            article.getArticles().success(function(data, status, headers, config) {
                $scope.articles = data;
                console.log('success with get articles!');
            });
            $scope.voteUp = function($event, articleId){
                $event.preventDefault();
                // TODO Implement colling voteUp API call
                article.voteUp(articleId);
            };
            $scope.voteDown = function($event, articleId){
                $event.preventDefault();
                // TODO Implement colling voteDown API call
                article.voteDown(articleId);
            };

            $scope.autoResizeTextarea = behaviour.autoResizeTextarea;
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
