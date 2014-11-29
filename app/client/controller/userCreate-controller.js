/**
 * Module for handling the creation of users
 * @class angular_controller.UserCreateModule
 * @memberOf angular_controller
 * @author Andy Hoegger
 * @since 12.11.2014
 */
var userCreateController = angular.module('userCreateController', [ 'service.authentication', 'service.user', 'service.authentication']);


/**
 * @name userCreateController
 * @description Controller for the creation of users
 * @function
 * @memberOf angular_controller.UserCreateModule
 */
userCreateController.controller('userCreateController', ['$scope', '$location', '$routeParams', 'authenticationState', 'userService', 'authenticationService', 'toaster',
    function ($scope, $location, $routeParams, authenticationState, userService, authenticationService, toaster) {
        $scope.$on('$viewContentLoaded', function () {
            var x = window.scrollX, y = window.scrollY;
            $("input[autofocus]:not([ng-readonly=true])").first().focus();
            window.scrollTo(x, y);
        });

        $scope.user = undefined;
        $scope.usernameReadOnly = false;

        var successfulStored = function (data) {
            console.log('User ' + $scope.user.userName + ' successfully created!');
            authenticationService.logIn($scope.user.userName, $scope.user.password)
                .success(loginSuccess);
        };

        var loginSuccess = function () {
            $location.path("/articles");
        };


        var loginInternal = function logIn(username, password) {
        };

        $scope.storeUser = function ($event) {
            $event.preventDefault();
            var userVar = {
                userName: $scope.user.userName,
                name: $scope.user.name,
                firstname: $scope.user.firstname,
                password: $scope.user.password
            };
            userService.createUser(userVar)
                .success(successfulStored)
                .error(function () {
                    toaster.pop('error', "User", data);
                });
        }
    }

]);

/**
 * @name equals
 * @description Directive for checking equality of two values
 * @function imageUrlFilter
 * @memberOf angular_controller.UserCreateModule
 */
userCreateController.directive('equals', function () {
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

/**
 * @name usedUser
 * @description Directive for checking a username is already in use
 * @function imageUrlFilter
 * @memberOf angular_controller.UserUpdateModule
 */
userCreateController.directive('usedUser', ['userService',
    function (userService) {
        return {
//        restrict: 'A', // only activate on element attribute
            require: '?ngModel', // get a hold of NgModelController
            link: function (scope, elem, attrs, ngModel) {
                var onSuccessUserLoad = function (data) {
                    console.dir(data);
                    // set validity
                    ngModel.$setValidity('usedUser', true);
                };
                var onErrorUserLoad = function (data) {
                    console.log('ERROR');
                };
                if (!ngModel) return; // do nothing if no ng-model

                // watch own value and re-validate on change
                scope.$watch(attrs.ngModel, function () {
                    validate();
                });

                var validate = function () {
                    // values
                    var val1 = ngModel.$viewValue;
                    userService.findUserByUsername(val1).success(onSuccessUserLoad).error(onErrorUserLoad);

                    // set validity
//                ngModel.$setValidity('equals', !val1 || !val2 || val1 === val2);
                };
            }
        }
    }]);
