/**
 * Module for handling the navigation
 * @class angular_controller.moduleNavigation
 * @memberOf angular_controller
 * @author Andy Hoegger
 * @since 15.09.2014
 */
var moduleNavigation = angular.module('moduleNavigation', ['service.authentication', 'service.user', 'toaster']);

/**
 * @name controllerNavigation
 * @description Controller for the navigation
 * @function
 * @memberOf angular_controller.moduleNavigation
 */
moduleNavigation.controller('controllerNavigation', ['$scope', '$rootScope', '$window', '$location', '$http', 'userService', 'authenticationService','authenticationState', 'toaster',
    function ($scope, $rootScope, $window, $location, $http, userService, authenticationService,authenticationState,toaster) {

        $scope.$watch(authenticationState.getUser, function(){
            $scope.user = authenticationState.getUser();
        });

        var doLoginInternal = function (event) {
            $location.path('/login')
        };
        var showUserDetailInternal = function($event){
            $event.preventDefault();
            $location.path('/user:'+$scope.user.id);
        };

        $scope.doLogin = doLoginInternal;

        $scope.showUserDetail = showUserDetailInternal;

        $scope.isActiveRoute = function (routeName) {
            var regex = new RegExp('/?' + routeName.toLowerCase() + '/?');
            return regex.test($location.path().toLowerCase());
        };
        $scope.logout = function ($event) {
            if ($event) {
                $event.preventDefault();
            }
            authenticationService.logOut();
            $location.path('/articles');
            toaster.pop('success', "Login", "Successfully logged out.", 1500);
        };
        $scope.createAccount = function ($event) {
            $event.preventDefault();
            // ensure the user create route is active
            $location.path("/user/create");
        };
    }
]);

