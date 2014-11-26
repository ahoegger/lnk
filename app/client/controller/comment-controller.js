/**
 * Created by Holger on 20.11.2014.
 * Controller for single comments to be used in the loop of the article
 */

var singleCommentController = angular.module('singleCommentController', ['service.article', 'service.user','service.authentication']);

singleCommentController.controller('singleCommentController', ['$scope', 'articleService', 'userService', 'authenticationState',
    function($scope, articleService,userService, authenticationState) {
        var loadUserById = function(userId){
            if( userId != undefined){
                userService.getUser(userId).success(function(data, status, headers, config){
                    $scope.user = data;
                });
            }else{
                $scope.user = undefined;
            }
            handleUserChanged();

        };

        $scope.$watch(authenticationState.getUserId, function(){
            $scope.userId = authenticationState.getUserId();
            loadUserById(authenticationState.getUserId());
        });

        var handleUserChanged = function(){
            $scope.hasEdit = false; // TODO Implement editing of comment
            $scope.hasDelete = $scope.user != undefined && $scope.comment._links.self != undefined && $scope.comment.submittedBy === $scope.user.userName;
            $scope.hasSubmitComment = $scope.user != undefined;
        };
        /**
         * This controller function deletes the article on the backend and removed the article from the collection
         */
        $scope.deleteComment = function() {
            // nice: implement check, if user is allowed to delete the article
            articleService.deleteComment($scope.comment._links.self.href,
                function(data, status, headers, config) {
                    console.log('deleted at backend with status' + status);
                    delete $scope.$parent.article._embedded.comments[$scope.$index];
                },
                function(data, status, headers, config) {
                    console.log('delete not successful, status = ' + status);
                });
        };

        handleUserChanged();
    }
]);

/**
 * This directive creates the html for deleting a comment
 */
singleCommentController.directive('deleteComment', function() {
    return {
        template: '<a ng-click="deleteComment()"><i class="fa fa-ban icon-passive"></i><span class="icon-spacer">Delete</span></a>'
    }
});