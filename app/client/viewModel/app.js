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
    ,'angular-momentjs'
]);

lnkApp.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
            when('/articles', {
                templateUrl: 'views/article-list.html',
                controller: 'articleListController'
            }).
            when('/add',{
                templateUrl: 'views/addArticle.html',
                controller: 'addArticle'
            }).
            when('/article/:articleId', {
                templateUrl: 'partials/phone-detail.html',
                controller: 'PhoneDetailCtrl'
            }).
            otherwise({
                redirectTo: '/articles'
            });
    }])
    .run(function($rootScope, $location) {
    $rootScope.$on( "$routeChangeStart", function(event, next, current) {
//            console.log('route changed');
//        if ($rootScope.loggedInUser == null) {
//            // no logged user, redirect to /login
//            if ( next.templateUrl === "partials/login.html") {
//            } else {
//                $location.path("/login");
//            }
//        }
    })});

