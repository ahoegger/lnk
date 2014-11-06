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

            var votingExecution = function(message, index) {
                var self = {
                    message: message,
                    index: index
                };
                return function(data, status, headers, config) {
                    console.log('Voting callback ' + self.message);
                    console.log(data);
                    $scope.articles[index].votes.numberOfVotes = data.vote;     // TODO Respect user vote
                }
            };

            $scope.voteUp = function($event, index, apiUrl){
                $event.preventDefault();
                console.dir(article);
                console.log(apiUrl);
                // TODO Implement calling voteUp API call
                article.voteUp(apiUrl,
                    votingExecution('VoteUp success', index),
                    votingExecution('VoteUp error', index)
                );
            };
            $scope.voteDown = function($event, index, apiUrl){
                $event.preventDefault();
                // TODO Implement calling voteDown API call
                article.voteDown(apiUrl,
                    votingExecution('VoteDown success', index),
                    votingExecution('VoteDown error', index)
                );
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


