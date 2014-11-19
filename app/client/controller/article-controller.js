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

        var votingExecutionFactory = function (message) {
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
                votingExecutionFactory('VoteUp success'),
                votingExecutionFactory('VoteUp error')
            );
        };
        $scope.voteDown2 = function ($event, apiUrl) {
            $event.preventDefault();
            articleService.voteDown(apiUrl,
                votingExecutionFactory('VoteDown success'),
                votingExecutionFactory('VoteDown error')
            );
        };

        /**
         * This controller function deletes the article on the backend and removed the article from the collection
         */
        $scope.deleteArticle = function() {
            // nice: implement check, if user is allowed to delete the article
            articleService.deleteArticle($scope.article._links.self.href,
            function(data, status, headers, config) {
                console.log('deleted an backend with status' + status);
                var idx = $scope.$parent.articles.indexOf($scope.article);
                $scope.$parent.articles.splice(idx,1);
            },
            function(data, status, headers, config) {
                console.log('delete not successful, status = ' + status);
            });
        };

        updateVotePropertyOnScope($scope);

        $scope.hasDelete = userServiceState.user != undefined && $scope.article._links.self != undefined && $scope.article.submittedBy === userServiceState.user.userName;
    }
]);


singleArticleController.directive('numberOfVotes', function() {
    return {
        template: '<span ng-show="article.hasVoteUp == true" <a ng-click="voteUp2($event, article._embedded.votes._links.voteUp.href)" class="vote icon-passive icon-activatable" href="#"><i class="fa fa-arrow-circle-o-up fa-2x"></i></a>'
    }
});

/**
 * This directive creates the html for deleting an article
 */
singleArticleController.directive('deleteArticle', function() {
    return {
        template: '<a ng-click="deleteArticle()"><i class="fa fa-ban icon-passive"></i><span class="icon-spacer">Delete</span></a>'
    }
});