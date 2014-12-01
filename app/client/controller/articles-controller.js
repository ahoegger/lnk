/**
 * Module for a collection of articles
 * @class angular_controller.ArticlesModule
 * @memberOf angular_controller
 * @author Andy Hoegger
 * @since 12.09.2014
 */
var articlesController = angular.module('articlesController', ['service.article', 'service.behaviour']);

/**
 * @name articleListController
 * @description Controller for handling a collection of articles
 * @function
 * @memberOf angular_controller.ArticlesModule
 */
articlesController.controller('articleListController', ['$scope', '$location', 'articleService', 'behaviour','toaster',
    function ($scope, $location, articleService, behaviour,toaster) {
        var errorLoadArticles = function (data, status) {
            toaster.pop('error', "Articles", data);
            console.log('error loading articles \'articlesController\': ' + status);
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
        var searchByApiInternal = function(apiUrl){
            articleService.getArticlesByApi(apiUrl,
                successLoadArticles,
                errorLoadArticles);
        };
        // input of search field
        $scope.textSearchQuery = undefined;
        // used for delete current query
        $scope.searchQuery = undefined;

        $scope.search = function ($event, searchText) {
            $scope.searchQuery = undefined;
            console.log(searchText);
            $scope.textSearchQuery = searchText;
            $scope.loadingArticles = true;
            articleService.getArticles(searchText)
                .success(successLoadArticles)
                .error(errorLoadArticles);
        };
        $scope.searchByTag = function(tag){
            $scope.textSearchQuery = undefined;
            $scope.searchQuery = 'Filter tag \''+tag.tag+'\'';
            searchByApiInternal(tag._links.articles.href);
        };
        $scope.searchByUser = function(user){
            $scope.textSearchQuery = undefined;
            $scope.searchQuery = 'Filter by user \''+user.userName+'\'';
            searchByApiInternal(user._links.articles.href);
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
 * @name dateFromNow
 * @description Filter for formatting a date in relation to now
 * @function
 * @memberOf angular_controller.ArticlesModule
 */
articlesController.filter('dateFromNow', function () {
    return function (input) {
        return moment(input).fromNow();
    };
});

/**
 * @name voteUpLink
 * @description Directive for creating the html code for voting up
 * @function
 * @memberOf angular_controller.ArticlesModule
 * @deprecated
 */
articlesController.directive('voteUpLink', function () {
    return {
        template: '<span ng-show="article._embedded.votes._links.voteUp.href">up</span><a ng-click="voteUp($event, $index, article._embedded.votes._links.voteUp.href)" class="vote icon-passive icon-activatable" href="#"><i class="fa fa-arrow-circle-o-up fa-2x"></i></a>'
    }
});