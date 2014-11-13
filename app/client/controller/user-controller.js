/**
 * Created by aho on 12.11.2014.
 */
var userController = angular.module('userController', [ 'service.authentication','service.user']);

userController.controller('userController', ['$scope','$location','$routeParams','userServiceState','userService',
    function ($scope, $location,$routeParams,   userServiceState, userService) {
        var userSuccessfulLoaded = function($data){
            console.dir($data);
            console.log("blubber");
        };

        userService.getUser($routeParams.id).success(userSuccessfulLoaded)
    }
    ]);