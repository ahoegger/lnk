/**
 * Created by aho on 15.09.2014.
 */


var navigationController = angular.module('navigationController', ['service.authentication', 'service.user']);

navigationController.controller('navigationController', ['$scope','$rootScope','$location', '$http', 'userServiceState', 'userService','authenticationService',
    function ($scope, $rootScope, $location,$http, userServiceState, userService,authenticationService) {
//        var updateUserData = function(userId){
//            userService.getUser(userId).success(function(data, status, headers, config){
//                console.dir(data);
//                console.log("user loaded: ")
//                $scope.user = data.user;
//            });
//        };
//        // watch userId on user state service
//        $scope.$watch(userServiceState.userId, function (newValue) {
//            updateUserData(newValue);
////            alert("isLoggedIn changed to " + newValue);
//        });
        $scope.userStateService = userServiceState;
        $scope.isActiveRoute = function(routeName){
            var regex = new RegExp('/?'+routeName.toLowerCase()+'/?');
            return regex.test($location.path().toLowerCase());
        }
        $scope.logout = function($event){
            if($event) {
                $event.preventDefault();
            }
            authenticationService.logOut();
        }
    }
]);

