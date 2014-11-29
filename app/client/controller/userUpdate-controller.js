/**
 * Module for handling updating users
 * @class angular_controller.UserUpdateModule
 * @memberOf angular_controller
 * @author Andy Hoegger
 * @since 12.11.2014
 */
var userUpdateController = angular.module('userUpdateController', [ 'service.authentication', 'service.user']);

/**
 * @name userCreateController
 * @description Controller for updating users
 * @function
 * @memberOf angular_controller.UserUpdateModule
 */
userUpdateController.controller('userUpdateController', ['$scope', '$location', '$routeParams', 'authenticationState', 'userService',
    function ($scope, $location, $routeParams, authenticationState, userService) {


        // have a copy of the user to ensure passwords are not bind. the password is anyway only a hash.
        var updateScopeUserInternal = function (user) {
            $scope.user =
            {
                id: user.id,
                userName: user.userName,
                name: user.name,
                firstname: user.firstname,
                active: true,
                password: undefined,
                password_verify: undefined
            };
        };

        var storeUserInternal = function ($event) {
            $event.preventDefault();
            var userVar = {
                id: $scope.user.id,
                userName: $scope.user.userName,
                name: $scope.user.name,
                firstname: $scope.user.firstname,
                password: $scope.user.password,
                active: $scope.user.active
            };
            userService.storeUser(userVar).success(successfulStored);
        };
        var successfulStored = function (data) {
            updateScopeUserInternal(data);
            authenticationState.setUser(data);
            $location.path('/articles');
        };

        // set initial focus
        $scope.$on('$viewContentLoaded', function () {
            var x = window.scrollX, y = window.scrollY;
            $("input[autofocus]:not([ng-readonly=true])").first().focus();
            window.scrollTo(x, y);
        });

        $scope.usernameReadOnly = true;
        $scope.user = undefined;

        $scope.storeUser = storeUserInternal;
        updateScopeUserInternal(authenticationState.getUser());
    }
]);

/**
 * @name equals
 * @description Directive for checking equality of two values
 * @function imageUrlFilter
 * @memberOf angular_controller.UserUpdateModule
 */
userUpdateController.directive('equals', function () {
    return {
//        restrict: 'A', // only activate on element attribute
        require: '?ngModel', // get a hold of NgModelController
        link: function (scope, elem, attrs, ngModel) {
            if (!ngModel) return; // do nothing if no ng-model

            // watch own value and re-validate on change
            scope.$watch(attrs.ngModel, function () {
                validate();
            });

            // observe the other value and re-validate on change
            attrs.$observe('equals', function (val) {
                validate();
            });

            var validate = function () {
                // values
                var val1 = ngModel.$viewValue;
                var val2 = attrs.equals;

                // set validity
                ngModel.$setValidity('equals', !val1 || !val2 || val1 === val2);
            };
        }
    }
});
