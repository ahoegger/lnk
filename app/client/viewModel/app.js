/**
 * Created by aho on 12.09.2014.
 */

//lnkApp
'use strict';

/* App Module */

var lnkApp = angular.module('lnkApp', [
    'ngRoute'
    , 'articlesController'
    ,'angular-momentjs'
]);

lnkApp.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
            when('/articles', {
                templateUrl: 'views/article-list.html',
                controller: 'articleListController'
            }).
            when('/article/:articleId', {
                templateUrl: 'partials/phone-detail.html',
                controller: 'PhoneDetailCtrl'
            }).
            otherwise({
                redirectTo: '/articles'
            });
    }]);
