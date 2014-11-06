/**
 * Created by aho on 15.09.2014.
 */


//var navigationController = angular.module('navigationController', []);

articlesController.controller('navigationController', ['$scope','$rootScope','$location',
    function ($scope, $rootScope, $location) {
        $scope.isActiveRoute = function(routeName){
            var regex = new RegExp('/?'+routeName.toLowerCase()+'/?');
            return regex.test($location.path().toLowerCase());
        }
    }
]);

