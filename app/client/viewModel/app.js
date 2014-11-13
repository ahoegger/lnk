/**
 * Created by aho on 12.09.2014.
 */

//lnkApp
'use strict';

/* App Module */

var lnkApp = angular.module('lnkApp', [
    'ngRoute'
    , 'articlesController'
    , 'addArticleController'
    , 'loginController'
    , 'navigationController'
    , 'userController'
    , 'angular-momentjs'
    , 'service.tokenInterceptor'
    , 'service.user'

]);

lnkApp.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
            when('/articles', {
                templateUrl: 'views/article-list.html',
                controller: 'articleListController',
                access: { requiredLogin: false }
            }).
            when('/add',{
                templateUrl: 'views/addArticle.html',
                controller: 'addArticle',
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
            when('/user:id',{
               templateUrl: 'views/userUpdate.html',
                controller: 'userController',
                access: { requiredLogin: true }
            }).
            otherwise({
                redirectTo: '/articles'
            });
    }
])
    .run(function($rootScope, $location, userServiceState) {
        $rootScope.$on("$routeChangeStart", function(event, nextRoute, currentRoute) {
            if (nextRoute.access.requiredLogin && !userServiceState.user) {
                $location.path("/login");
            }
        });
//        $rootScope.$on( "$routeChangeStart", function(event, next, current) {
//        console.log('route to: '+next.templateUrl);
//        console.dir(next);
////            console.log('route changed');
////        if ($rootScope.loggedInUser == null) {
////            // no logged user, redirect to /login
////            if ( next.templateUrl === "partials/login.html") {
////            } else {
////                $location.path("/login");
////            }
////        }
//        })
    });

lnkApp.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push('tokenInterceptor');
}]);



