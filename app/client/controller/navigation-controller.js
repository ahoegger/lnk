/**
 * Created by aho on 15.09.2014.
 */


var navigationController = angular.module('navigationController', []);

articlesController.controller('navigationController', ['$scope','$rootScope',
    function ($scope, $rootScope) {
        $rootScope.$on( "$routeChangeStart", function(event, next, current) {
            console.log('route changed to '+next.originalPath);
            $scope.currentPath = next.originalPath;
        });
    }
]);

