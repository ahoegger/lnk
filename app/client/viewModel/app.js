'use strict';

/**
 * Module of the magnificent .lnk application
 * @class angular_app.AppModule
 * @memberOf angular_app
 * @author Andy Hoegger
 * @since 12.09.2014
 */
var lnkApp = angular.module('lnkApp', [
    'ngRoute'
    , 'articlesController'
    , 'singleArticleController'
    , 'singleCommentController'
    , 'addArticleController'
    , 'loginController'
    , 'navigationController'
    , 'userUpdateController'
    , 'userCreateController'
    , 'angular-momentjs'
    , 'service.tokenInterceptor'
    , 'service.user'
    , 'service.authentication'
    , 'socket'

]);

/**
 * Application configuration of the routes
 * @function angular_app.config
 * @memberOf angular_app.AppModule
 * @author Andy Hoegger
 * @since 12.09.2014
 */
lnkApp.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
            when('/articles', {
                templateUrl: 'views/article-list.html',
                controller: 'articleListController',
                access: { requiredLogin: false }
            }).
            when('/article/add',{
                templateUrl: 'views/addArticle.html',
                controller: 'addArticleController',
                access: { requiredLogin: true }

            }).
            when('/article/:articleId', {
                templateUrl: 'partials/phone-detail.html',
                controller: 'PhoneDetailCtrl',
                access: { requiredLogin: false }
            }).
            when('/login',{
                templateUrl: 'views/login.html',
                controller: 'loginController',
                access: { requiredLogin: false }
            }).
            when('/user/create',{
                templateUrl: 'views/userUpdate.html',
                controller: 'userCreateController',
                access: { requiredLogin: false }
            }).
            when('/user:id',{
               templateUrl: 'views/userUpdate.html',
                controller: 'userUpdateController',
                access: { requiredLogin: true }
            }).
            otherwise({
                redirectTo: '/articles'
            });
    }
])
    .run(function($rootScope, $location,$timeout, authenticationState,toaster) {
        $rootScope.$on("$routeChangeStart", function(event, nextRoute, currentRoute) {
            console.log('route to: '+nextRoute.templateUrl);
            // check if the route requires authentication if so route to login mask.
            if (nextRoute.access && nextRoute.access.requiredLogin && authenticationState.getUser() == undefined) {
                toaster.pop('error', null, "Authentication required!");
                $location.path("/login");
            }
        });


        /**
         * Global funciton to set the focus on the first enabled element having the autofocus tag.
         * @function angular_app.AppModule
         * @memberOf angular_app.AppModule
         * @author Andy Hoegger
         * @since 30.11.2014
         */
        $rootScope.$on("$routeChangeSuccess", function(event, nextRoute, currentRoute) {
            $timeout(function() {
                // backup scroll position
                var x = window.scrollX, y = window.scrollY;
                // set focus
                $("input[autofocus]:not([ng-readonly=true])").first().focus();
                // restore scroll position to avoid scrolling
                window.scrollTo(x, y);
            });
        });
    });

/**
 * Application configuration of the http service provider
 * @function angular_app.AppModule
 * @memberOf angular_app.AppModule
 * @author Andy Hoegger
 * @since 12.09.2014
 */
lnkApp.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push('tokenInterceptor');
}]);



