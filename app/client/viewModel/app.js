/**
 * Created by aho on 12.09.2014.
 */

//lnkApp
'use strict';

/* App Module */

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
    .run(function($rootScope, $location, authenticationState) {

        $rootScope.$on("$routeChangeStart", function(event, nextRoute, currentRoute) {
            console.log('route to: '+nextRoute.templateUrl);
            if (nextRoute.access && nextRoute.access.requiredLogin && !authenticationState.getUserId()) {
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



