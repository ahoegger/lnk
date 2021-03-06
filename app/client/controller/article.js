/**
 * Module for single articles
 * @class angular_controller.moduleArticle
 * @memberOf angular_controller
 * @author Holger Heymanns
 * @since 17.11.2014
 */
var moduleArticle = angular.module('moduleArticle', ['service.article', 'service.authentication', 'socket']);

/**
 * @name controllerArticle
 * @description Controller for handling single article issues
 * @function
 * @memberOf angular_controller.moduleArticle
 */
moduleArticle.controller('controllerArticle', ['$scope', 'articleService', 'authenticationState', 'socket', 'toaster',
    function ($scope, articleService, authenticationState, socket, toaster) {

        // add watch to auth state userId to update visibility of delete.
        $scope.$watch(authenticationState.getUser, function () {
            handleUserChanged();
        });

        var handleUserChanged = function () {
            $scope.hasDelete = authenticationState.getUser() != undefined && $scope.article._links.self != undefined && $scope.article._embedded.user.id === authenticationState.getUser().id;
            $scope.hasSubmitComment = authenticationState.getUser() != undefined;
        };

        var commentsLoaded = false;

        var updateVotePropertyOnScope = function ($scope) {
            $scope.article.hasVoteUp = $scope.user != undefined && $scope.article._embedded.votes._links.voteUp != undefined;
            $scope.article.hasVoteDown = $scope.user != undefined && $scope.article._embedded.votes._links.voteDown != undefined;
        };

        // listener on websockt event broadcast to update the vote
        socket.on('vote:updated', function (data) {
            // received an updated vote. search, if the the available articles, there is one with the given id and then update it's vote value
            if ($scope.article.id === data.articleId) {
                $scope.article._embedded.votes = data;
            }
        });

        var votingExecutionFactory = function (message) {
            socket.emit('voted:update', {
                thingy: 'super cool"'
            });
            var self = {
                message: message
            };
            return function (data, status) {
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
        $scope.deleteArticle = function () {
            // nice: implement check, if user is allowed to delete the article
            articleService.deleteArticle($scope.article._links.self.href)
                .success(
                function (data, status) {
                    console.log('deleted an backend with status' + status);
                    var idx = $scope.$parent.articles.indexOf($scope.article);
                    // removes the deleted article out of the article array.
                    $scope.$parent.articles.splice(idx, 1);
                }
            ).error(
                // error handling
                function (data, status) {
                    toaster.pop('error', "Article", data);
                }
            );
        };

        $scope.submitComment = function ($event, index, apiUrl, articleId) {
            var commentObject;
            $event.preventDefault();
            $scope.submittingComment = true;
            commentObject = {
                articleId: articleId,
                text: $event.srcElement[0].value,
                submittedOn: new Date()
            };
            articleService.submitComment(apiUrl, commentObject)
                .success(
                function (data) {
                    console.log('Submit comment callback ' + self.message);
                    console.log(data);
                    // Finally, add the comment object from the response to the viewModel
                    $scope.article._embedded.comments.push(data);
                    $event.target[0].value = '';
                    $scope.submittingComment = false;
                })
                .error(
                // error handling
                function (data) {
                    toaster.pop('error', "Comment", data);
                    $scope.submittingComment = false;
                }
            );
        };


        $scope.hasEdit = false;

        $scope.hasCommentsLoaded = commentsLoaded;      // make state of loaded comments accessible
        $scope.loadingComments = false;
        $scope.submittingComment = false;

        $scope.doShowComments = function ($event) {
            $event.preventDefault();
            if (commentsLoaded == false) {
                $scope.loadingComments = true;
                articleService.loadComments($scope.article._links.comments.href)
                    .success(
                    function (data) {
                        if ($scope.article._embedded == undefined) {
                            $scope.article._embedded = {};
                        }
                        $scope.article._embedded.comments = data;
                        commentsLoaded = true;
                        $scope.showComments = true;
                        $scope.loadingComments = false;
                    })
                    .error(
                    function (data, status) {
                        toaster.pop('error', "Article", data);
                        $scope.loadingComments = false;
                    });
            } else {
                // comments are already loaded, so simply show them
                $scope.showComments = true;
            }
        };

        handleUserChanged();
        updateVotePropertyOnScope($scope);
    }
]);

/**
 * @name numberOfVotes
 * @description Directive for creating the html code displaying the number of votes and the vote up / vote down arrows
 * @function
 * @memberOf angular_controller.ArticleModule
 */
moduleArticle.directive('numberOfVotes', function () {
    return {
        template: '<span ng-show="article.hasVoteUp == true" <a ng-click="voteUp2($event, article._embedded.votes._links.voteUp.href)" class="vote icon-passive icon-activatable" href="#"><i class="fa fa-arrow-circle-o-up fa-2x"></i></a>'
    }
});

/**
 * @name deleteArticle
 * @description Directive for creating the html code for deleting an article
 * @function
 * @memberOf angular_controller.ArticleModule
 */
moduleArticle.directive('deleteArticle', function () {
    return {
        template: '<a role="button" ng-click="deleteArticle()"><i class="fa fa-ban icon-passive"></i><span class="icon-spacer">Delete</span></a>'
    }
});