/**
 * Created by aho on 12.11.2014.
 */
var userUpdateController = angular.module('userUpdateController', [ 'service.authentication','service.user']);

userUpdateController.controller('userUpdateController', ['$scope','$location','$routeParams','userServiceState','userService',
    function ($scope, $location,$routeParams,   userServiceState, userService) {
        $scope.$on('$viewContentLoaded', function(){
            $("input[autofocus]:not([ng-readonly])").first().focus();
        });

        $scope.usernameReadOnly = true;
        $scope.user = undefined;
//        {
//            id : 2,
//            userName: 'admin',
//            name: 'Administrator',
//            firstname : 'Hans',
//            password: undefined,
//            active: true,
//            password_verify : undefined
//        };
        var userSuccessfulLoaded = function($data){
            $scope.user = $data.user;
            console.dir($data);
            console.log("blubber");
        };
        var successfulStored= function($data){
            $scope.user = $data.user;
            console.dir($data);
            console.log("blubber");
            $location.path('/articles');
        };
        $scope.storeUser = function($event){
            $event.preventDefault();
            var userVar = {
                id : $scope.user.id,
                userName : $scope.user.userName,
                name : $scope.user.name,
                firstname : $scope.user.firstname,
                password : $scope.user.password,
                active : $scope.user.active
            };
            userService.storeUser(userVar).success(successfulStored);
            userServiceState.user = userVar;
        }
        if(userServiceState.user) {
            var routeParamUser = $routeParams.id.replace('^\:*','');
            console.log('route user id:'+routeParamUser);
            userService.getUser(userServiceState.user.id).success(userSuccessfulLoaded);
        }
    }
    ]);


userUpdateController.directive('equals', function() {
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
