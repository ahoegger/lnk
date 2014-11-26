/**
 * Created by aho on 15.09.2014.
 */


var navigationController = angular.module('navigationController', ['service.authentication', 'service.user']);

navigationController.controller('navigationController', ['$scope', '$rootScope', '$window', '$location', '$http', 'userService', 'authenticationService','authenticationState',
    function ($scope, $rootScope, $window, $location, $http, userService, authenticationService,authenticationState) {
//        var loadUserById = function(userId){
//            if( userId != undefined){
//                userService.getUser(userId).success(function(data, status, headers, config){
//                    console.dir(data);
//                    console.log("user loaded: ")
//                    $scope.user = data;
//                });
//            }else{
//                $scope.user = undefined;
//            }
//
//        };

        $scope.$watch(authenticationState.getUser, function(){
            $scope.user = authenticationState.getUser();
//            $scope.userId = authenticationState.getUserId();
//            loadUserById(authenticationState.getUserId());
        });
//        // watch userId on user state service
//        $scope.$watch(userServiceState.userId, function (newValue) {
//            updateUserData(newValue);
////            alert("isLoggedIn changed to " + newValue);
//        });
        var doLoginInternal = function (event) {
            $location.path('/login')
        }
//        var loadUserByIdInternal = function (userId){
//          userService.getUser
//        };
        $scope.doLogin = doLoginInternal;

//        $scope.user = userServiceState.getUser();
//        $scope.userStateService = userServiceState;

        $scope.isActiveRoute = function (routeName) {
            var regex = new RegExp('/?' + routeName.toLowerCase() + '/?');
            return regex.test($location.path().toLowerCase());
        }
        $scope.logout = function ($event) {
            if ($event) {
                $event.preventDefault();
            }
            authenticationService.logOut();
        }
    }
]);

