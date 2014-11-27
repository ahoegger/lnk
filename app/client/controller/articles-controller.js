/**
 * Created by aho on 12.09.2014.
 */
var articlesController = angular.module('articlesController', ['service.article', 'service.behaviour']);

articlesController.controller('articleListController', ['$scope', '$location', 'articleService', 'behaviour',
    function ($scope, $location, articleService, behaviour) {
        var errorLoadArticles = function (data, status) {
            console.log('error loading articles \'articlesController\': ' + status);
            $scope.error = data;
        };
        var successLoadArticles = function (data) {
            $scope.articles = data;
            console.log('success with get articles!');
            $scope.loadingArticles = false;

        };

        $scope.loadingArticle = false;

        var initialize = function () {
            $scope.loadingArticles = true;
            articleService.getArticles().success(successLoadArticles).error(errorLoadArticles);
        };

        var votingExecution = function (message, index) {
            var self = {
                message: message,
                index: index
            };
            return function (data, status) {
                console.log('Voting callback ' + self.message);
                console.log(data);
                if (status === 200 || status === 201) {
                    $scope.articles[index].votes = data;
                }
            }
        };

        $scope.search = function () {
            console.log($scope.searchQuery);
            $scope.loadingArticles = true;
            articleService.getArticles($scope.searchQuery)
                .success(successLoadArticles)
                .error(errorLoadArticles);
        };

        $scope.searchByApi = function(apiUrl) {
            console.log('Search articles by given API url ' + apiUrl);
            articleService.getArticlesByApi(apiUrl,
                successLoadArticles,
                errorLoadArticles);
        };
        $scope.voteUp = function ($event, index, apiUrl) {
            $event.preventDefault();
            console.log(apiUrl);
            articleService.voteUp(apiUrl,
                votingExecution('VoteUp success', index),
                votingExecution('VoteUp error', index)
            );
        };
        $scope.voteDown = function ($event, index, apiUrl) {
            $event.preventDefault();
            articleService.voteDown(apiUrl,
                votingExecution('VoteDown success', index),
                votingExecution('VoteDown error', index)
            );
        };


        $scope.autoResizeTextarea = behaviour.autoResizeTextarea;

        initialize();
    }]);

/**
 * a filter to format the submitted date into a relative date from now like 'few seconds ago'
 */
articlesController.filter('dateFromNow', function () {
    return function (input, $moment) {
        return moment(input).fromNow();
    };
});


articlesController.directive('voteUpLink', function () {
    return {
        template: '<span ng-show="article._embedded.votes._links.voteUp.href">up</span><a ng-click="voteUp($event, $index, article._embedded.votes._links.voteUp.href)" class="vote icon-passive icon-activatable" href="#"><i class="fa fa-arrow-circle-o-up fa-2x"></i></a>'
    }
});