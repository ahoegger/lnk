/**
 * Created by aho on 15.09.2014.
 */


var navigationController = angular.module('navigationController', ['service.authentication']);

navigationController.controller('navigationController', ['$scope','$rootScope','$location','AuthenticationService','UserService',
    function ($scope, $rootScope, $location, AuthenticationService,UserService) {
        $scope.authenticationService = AuthenticationService;
        $scope.isActiveRoute = function(routeName){
            var regex = new RegExp('/?'+routeName.toLowerCase()+'/?');
            return regex.test($location.path().toLowerCase());
        }
        $scope.logout = function($event){
            if($event) {
                $event.preventDefault();
            }
            UserService.logOut();
        }
    }
]);

