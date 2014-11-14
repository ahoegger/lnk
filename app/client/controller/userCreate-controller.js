/**
 * Created by aho on 12.11.2014.
 */
var userCreateController = angular.module('userCreateController', [ 'service.authentication','service.user', 'service.authentication']);

userCreateController.controller('userCreateController', ['$scope','$location','$routeParams','userServiceState','userService','authenticationService',
    function ($scope, $location,$routeParams,   userServiceState, userService,authenticationService) {
        $scope.$on('$viewContentLoaded', function(){
            $("input[autofocus]:not([ng-readonly=true])").first().focus();
        });

        $scope.user = undefined;
        $scope.usernameReadOnly = false;

        var successfulStored= function(data){
            console.log('User '+$scope.user.userName+' successfully created!');
            loginInternal($scope.user.userName, $scope.user.password);

        };

        var loginSuccess = function() {
            $location.path("/articles");
        };


        var loginInternal = function logIn(username, password) {
            authenticationService.logIn(username, password,loginSuccess);
        };

        $scope.storeUser = function($event){
            $event.preventDefault();
            var userVar = {
                userName : $scope.user.userName,
                name : $scope.user.name,
                firstname : $scope.user.firstname,
                password : $scope.user.password
            };
            userService.createUser(userVar).success(successfulStored);
        }
    }
    ]);


userCreateController.directive('equals', function() {
    return {
//        restrict: 'A', // only activate on element attribute
        require: '?ngModel', // get a hold of NgModelController
        link: function(scope, elem, attrs, ngModel) {
            if(!ngModel) return; // do nothing if no ng-model

            // watch own value and re-validate on change
            scope.$watch(attrs.ngModel, function() {
                validate();
            });

            // observe the other value and re-validate on change
            attrs.$observe('equals', function (val) {
                validate();
            });

            var validate = function() {
                // values
                var val1 = ngModel.$viewValue;
                var val2 = attrs.equals;

                // set validity
                ngModel.$setValidity('equals', ! val1 || ! val2 || val1 === val2);
            };
        }
    }
});
