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
    ,'angular-momentjs',
    'service.tokenInterceptor'
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
            when('/login',{
                templateUrl: 'views/login.html',
                controller: 'loginController'
            }).
            when('/user:id',{
               templateUrl: 'views/userUpdate.html',
                controller: 'userController'
            }).
            otherwise({
                redirectTo: '/articles'
            });
    }
])
    .run(function($rootScope, $location) {
    $rootScope.$on( "$routeChangeStart", function(event, next, current) {
        console.log('route to: '+next.templateUrl);
        console.dir(next);
//            console.log('route changed');
//        if ($rootScope.loggedInUser == null) {
//            // no logged user, redirect to /login
//            if ( next.templateUrl === "partials/login.html") {
//            } else {
//                $location.path("/login");
//            }
//        }
    })});

lnkApp.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push('tokenInterceptor');
}]);



