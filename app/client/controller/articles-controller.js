/**
 * Created by aho on 12.09.2014.
 */
    var articlesController = angular.module('articlesController', ['service.article', 'service.behaviour']);

    articlesController.controller('articleListController', ['$scope', '$location','articleService', 'behaviour',
        function ($scope,  $location, articleService, behaviour) {
            var successLoadArticles = function(data, status, headers, config) {
                $scope.articles = data;
                console.log('success with get articles!');
                $scope.loadingArticles = false;
            };

            var errorLoadArticles = function(data, status, headers, config) {
                console.log('error with get articles. Status = ' + status);
                $scope.loadingArticles = false;
            };

            $scope.loadingArticle = false;

            var initialize = function() {
                $scope.loadingArticles = true;
                articleService.getArticles()
                    .success(successLoadArticles)
                    .error(errorLoadArticles);
            };

            var submitCommentExecution = function(message, index) {
                var self = {
                    message: message,
                    index: index
                };
                return function(data, status, headers, config) {
                    console.log('Submit comment callback ' + self.message);
                    console.log(data);
                }
            };

            var votingExecution = function(message, index) {
                var self = {
                    message: message,
                    index: index
                };
                return function(data, status, headers, config) {
                    console.log('Voting callback ' + self.message);
                    console.log(data);
                    if (status === 200 || status === 201) {
                        $scope.articles[index].votes = data;
                    }
                }
            };

            $scope.search = function(){
                console.log($scope.searchQuery);
                $scope.loadingArticles = true;
                articleService.getArticles($scope.searchQuery)
                    .success(successLoadArticles)
                    .error(errorLoadArticles);
            };
            $scope.voteUp = function($event, index, apiUrl){
                $event.preventDefault();
                console.dir(article);
                console.log(apiUrl);
                articleService.voteUp(apiUrl,
                    votingExecution('VoteUp success', index),
                    votingExecution('VoteUp error', index)
                );
            };
            $scope.voteDown = function($event, index, apiUrl){
                $event.preventDefault();
                articleService.voteDown(apiUrl,
                    votingExecution('VoteDown success', index),
                    votingExecution('VoteDown error', index)
                );
            };
            $scope.submitComment = function($event, index, apiUrl, articleId) {
                var commentObject;
                $event.preventDefault();
                commentObject = {
                    articleId: articleId,
                    text: $event.target[0].value,
                    submittedBy: 'FIXME',
                    submittedOn: new Date()
                };
                articleService.submitComment(apiUrl,
                    commentObject,
                    function(data, status, headers, config) {
                        console.log('Submit comment callback ' + self.message);
                        console.log(data);
                        // Finally, add the comment object from the response to the viewModel
                        $scope.articles[index]._embedded.comments[data.id] = data;
                        $event.target[0].value = '';
                    },
                    submitCommentExecution('Submit comment error', index)
                );
            };

            $scope.autoResizeTextarea = behaviour.autoResizeTextarea;

            initialize();
        }]);

/**
 * a filter to format the submitted date into a relative date from now like 'few seconds ago'
 */
articlesController.filter('dateFromNow', function() {
    return function(input, $moment) {
        return moment(input).fromNow();
    };
});


articlesController.directive('voteUpLink', function() {
    return {
        template: '<span ng-show="article._embedded.votes._links.voteUp.href">up</span><a ng-click="voteUp($event, $index, article._embedded.votes._links.voteUp.href)" class="vote icon-passive icon-activatable" href="#"><i class="fa fa-arrow-circle-o-up fa-2x"></i></a>'
    }
});