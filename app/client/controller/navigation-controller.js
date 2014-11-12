/**
 * Created by aho on 15.09.2014.
 */


var navigationController = angular.module('navigationController', ['service.authentication']);

navigationController.controller('navigationController', ['$scope','$rootScope','$location','AuthenticationService',
    function ($scope, $rootScope, $location, AuthenticationService) {
        $scope.authenticationService = AuthenticationService;
        $scope.user = AuthenticationService.isLogged;
        $scope.$watch(AuthenticationService.isLogged, function (newVal, oldVal, scope) {
            $scope.user = newVal;
            console.log('login changed! '+newVal);
        });
        $scope.isActiveRoute = function(routeName){
            var regex = new RegExp('/?'+routeName.toLowerCase()+'/?');
            return regex.test($location.path().toLowerCase());
        }
    }
]);

