/**
 * Created by Holger on 17.11.2014.
 */
var singleArticleController = angular.module('singleArticleController', ['service.article', 'service.user','service.authentication', 'socket']);

singleArticleController.controller('singleArticleController', ['$scope', 'articleService','userService', 'authenticationState', 'socket',
    function($scope, articleService, userService,authenticationState, socket) {

//        var loadUserById = function(userId){
//            if( userId != undefined){
//                userService.getUser(userId).success(function(data, status, headers, config){
//                    $scope.user = data;
//                });
//            }else{
//                $scope.user = undefined;
//            }
//            handleUserChanged();
//
//        };
//
        $scope.$watch(authenticationState.getUserId, function(){
//            $scope.userId = authenticationState.getUserId();
//            loadUserById(authenticationState.getUserId());
            handleUserChanged();
        });

        var author = $scope.article._embedded.user;

        var handleUserChanged = function(){
            $scope.hasDelete = $scope.article._links.self != undefined && $scope.article._embedded.user.id === authenticationState.getUserId();
            $scope.hasSubmitComment = authenticationState.getUserId() != undefined;
        }

        var commentsLoaded = false;

        var updateVotePropertyOnScope = function($scope) {
            $scope.article.hasVoteUp = $scope.user != undefined && $scope.article._embedded.votes._links.voteUp != undefined;
            $scope.article.hasVoteDown = $scope.user != undefined && $scope.article._embedded.votes._links.voteDown != undefined;
        };

        // listener on websockt event broadcast to update the vote
        socket.on('vote:updated', function(data) {
            // received an updated vote. search, if the the available articles, there is one with the given id and then update it's vote value
                if($scope.article.id === data.articleId) {
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

        var submitCommentExecution = function (message, index) {
            var self = {
                message: message,
                index: index
            };
            return function (data, status, headers, config) {
                console.log('Submit comment callback ' + self.message);
                console.log(data);
                $scope.submittingComment = false;
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

        $scope.newCommentValue;

        $scope.submitComment = function ($event, index, apiUrl, articleId) {
            var commentObject;
            $event.preventDefault();
            $scope.submittingComment = true;
            commentObject = {
                articleId: articleId,
                text: $event.srcElement[0].value,
                submittedOn: new Date()
            };
            articleService.submitComment(apiUrl,
                commentObject,
                function (data, status, headers, config) {
                    console.log('Submit comment callback ' + self.message);
                    console.log(data);
                    // Finally, add the comment object from the response to the viewModel
                    $scope.articles[index]._embedded.comments.push(data);
                    $event.target[0].value = '';
                    $scope.submittingComment = false;
                },
                submitCommentExecution('Submit comment error', index)
            );
        };



        $scope.hasEdit = false; // TODO Implement editing of article
//        $scope.hasDelete = $scope.user && $scope.article._links.self != undefined && $scope.article.submittedBy === $scope.user.userName;

        $scope.hasCommentsLoaded = commentsLoaded;      // make state of loaded comments accessible
        $scope.loadingComments = false;
        $scope.submittingComment = false;

        $scope.doShowComments = function($event) {
            $event.preventDefault();
            if (commentsLoaded == false) {
                $scope.loadingComments = true;
                articleService.loadComments($scope.article._links.comments.href,
                    function (data, status, headers, config) {
                        if ($scope.article._embedded == undefined) {
                            $scope.article._embedded = {};
                        }
                        $scope.article._embedded.comments = data;
                        commentsLoaded = true;
                        $scope.showComments = true;
                        $scope.loadingComments = false;
                    },
                    function (data, status, headers, config) {
                        console.log('Error ' + status + ' loading comments: ' + data);
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