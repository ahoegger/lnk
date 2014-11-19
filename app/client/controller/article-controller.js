/**
 * Created by Holger on 17.11.2014.
 */
var singleArticleController = angular.module('singleArticleController', ['service.article', 'service.user']);

singleArticleController.controller('singleArticleController', ['$scope', 'articleService', 'userServiceState',
    function($scope, articleService, userServiceState) {

        var updateVotePropertyOnScope = function($scope) {
            $scope.article.hasVoteUp = userServiceState.user != undefined && $scope.article._embedded.votes._links.voteUp != undefined;
            $scope.article.hasVoteDown = userServiceState.user != undefined && $scope.article._embedded.votes._links.voteDown != undefined;
        };

        var votingExecution = function (message) {
            var self = {
                message: message
            };
            return function (data, status, headers, config) {
                console.log('Voting callback ' + self.message);
                console.log(data);
                if (status === 200 || status === 201) {
                    $scope.article._embedded.votes = data;
                    // nice: refactor to listener approach
                    updateVotePropertyOnScope($scope);
                }
            }
        };

        $scope.voteUp2 = function ($event, apiUrl) {
            $event.preventDefault();
            console.log(apiUrl);
            articleService.voteUp(apiUrl,
                votingExecution('VoteUp success'),
                votingExecution('VoteUp error')
            );
        };
        $scope.voteDown2 = function ($event, apiUrl) {
            $event.preventDefault();
            articleService.voteDown(apiUrl,
                votingExecution('VoteDown success'),
                votingExecution('VoteDown error')
            );
        };

        $scope.$on('updatedVotes', function(event, args) {
            $scope.nov = $scope.article.votes.numberOfVotes;
            $scope.article.hasVoteUp = $scope.article._embedded.votes._links.voteUp != undefined;
            $scope.article.hasVoteDown = $scope.article._embedded.votes._links.voteDown != undefined;
        });

        updateVotePropertyOnScope($scope);
    }
]);


singleArticleController.directive('numberOfVotes', function() {
    return {
        template: '<span ng-show="article.hasVoteUp == true" <a ng-click="voteUp2($event, article._embedded.votes._links.voteUp.href)" class="vote icon-passive icon-activatable" href="#"><i class="fa fa-arrow-circle-o-up fa-2x"></i></a>'
    }
});