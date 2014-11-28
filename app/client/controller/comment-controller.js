/**
 * Module for handling a comment
 * @class angular_controller.CommentModule
 * @memberOf angular_controller
 * @author Holger Heymanns
 * @since 20.11.2014
 */
var singleCommentController = angular.module('singleCommentController', ['service.article', 'service.user', 'service.authentication']);

/**
 * @name singleCommentController
 * @description Controller for a single comment
 * @function
 * @memberOf angular_controller.CommentModule
 */
singleCommentController.controller('singleCommentController', ['$scope', 'articleService', 'userService', 'authenticationState',
    function ($scope, articleService, userService, authenticationState) {


        $scope.$watch(authenticationState.getUser, function () {
            handleUserChanged();
        });

        var handleUserChanged = function () {
            $scope.hasEdit = false; // TODO Implement editing of comment
            $scope.hasDelete = authenticationState.getUser() != undefined && $scope.comment._links.self != undefined && $scope.comment._embedded.user.userName == authenticationState.getUser().userName;
            $scope.hasSubmitComment = authenticationState.getUser() != undefined;
        };
        /**
         * This controller function deletes the article on the backend and removed the article from the collection
         */
        $scope.deleteComment = function () {
            // nice: implement check, if user is allowed to delete the article
            articleService.deleteComment($scope.comment._links.self.href,
                function (data, status) {
                    console.log('deleted at backend with status' + status);
                    delete $scope.$parent.article._embedded.comments.splice($scope.$index,1);
                },
                function (data, status) {
                    console.log('delete not successful, status = ' + status);
                });
        };

        handleUserChanged();
    }
]);

/**
 * @name deleteComment
 * @description Directive that creates the HTML for deleting a comment
 * @function
 * @memberOf angular_controller.CommentModule
 */
singleCommentController.directive('deleteComment', function () {
    return {
        template: '<a ng-click="deleteComment()"><i class="fa fa-ban icon-passive"></i><span class="icon-spacer">Delete</span></a>'
    }
});