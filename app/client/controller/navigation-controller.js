/**
 * Module for handling the navigation
 * @class angular_controller.NavigationModule
 * @memberOf angular_controller
 * @author Andy Hoegger
 * @since 15.09.2014
 */
var navigationController = angular.module('navigationController', ['service.authentication', 'service.user']);

/**
 * @name navigationController
 * @description Controller for the navigation
 * @function
 * @memberOf angular_controller.NavigationModule
 */
navigationController.controller('navigationController', ['$scope', '$rootScope', '$window', '$location', '$http', 'userService', 'authenticationService','authenticationState',
    function ($scope, $rootScope, $window, $location, $http, userService, authenticationService,authenticationState) {

        $scope.$watch(authenticationState.getUser, function(){
            $scope.user = authenticationState.getUser();
        });

        var doLoginInternal = function (event) {
            $location.path('/login')
        };

        var logoutSuccess = function(){
            $location.path('/articles');
        };

        $scope.doLogin = doLoginInternal;

        $scope.isActiveRoute = function (routeName) {
            var regex = new RegExp('/?' + routeName.toLowerCase() + '/?');
            return regex.test($location.path().toLowerCase());
        }
        $scope.logout = function ($event) {
            if ($event) {
                $event.preventDefault();
            }
            authenticationService.logOut(logoutSuccess);

        }
    }
]);

