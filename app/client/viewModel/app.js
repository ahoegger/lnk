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
            when('/article/add', {
                templateUrl: 'views/addArticle.html',
                controller: 'addArticleController',
                access: { requiredLogin: true }

            }).
            when('/article/:articleId', {
                templateUrl: 'partials/phone-detail.html',
                controller: 'PhoneDetailCtrl',
                access: { requiredLogin: false }
            }).
            when('/login', {
                templateUrl: 'views/login.html',
                controller: 'loginController',
                access: { requiredLogin: false }
            }).
            when('/user/create', {
                templateUrl: 'views/userUpdate.html',
                controller: 'userCreateController',
                access: { requiredLogin: false }
            }).
            when('/user:id', {
                templateUrl: 'views/userUpdate.html',
                controller: 'userUpdateController',
                access: { requiredLogin: true }
            }).
            otherwise({
                redirectTo: '/articles'
            });
    }
])
    .run(function ($rootScope, $location, $timeout, authenticationState, toaster) {
        $rootScope.$on("$routeChangeStart", function (event, nextRoute, currentRoute) {
            console.log('route to: ' + nextRoute.templateUrl);
            // check if the route requires authentication if so route to login mask.
            if (nextRoute.access && nextRoute.access.requiredLogin && authenticationState.getUser() == undefined) {
                toaster.pop('error', null, "Authentication required!");
                $location.path("/login");
            }
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

/**
 * @name equals
 * @description Directive for checking equality of two values
 * @function imageUrlFilter
 * @memberOf angular_app.AppModule
 */
lnkApp.directive('equals', function () {
    return {
//        restrict: 'A', // only activate on element attribute
        require: '?ngModel', // get a hold of NgModelController
        link: function (scope, elem, attrs, ngModel) {
            if (!ngModel) return; // do nothing if no ng-model

            // watch own value and re-validate on change
            scope.$watch(attrs.ngModel, function () {
                validate();
            });

            // observe the other value and re-validate on change
            attrs.$observe('equals', function (val) {
                validate();
            });

            var validate = function () {
                // values
                var val1 = ngModel.$viewValue;
                var val2 = attrs.equals;

                // set validity
                ngModel.$setValidity('equals', !val1 || !val2 || val1 === val2);
            };
        }
    }
});


/**
 * @name username
 * @description Directive for checking a username is already in use
 * @function imageUrlFilter
 * @memberOf angular_app.AppModule
 */
lnkApp.directive('username', ['userService',
    function (userService) {
        return {
//        restrict: 'A', // only activate on element attribute
            require: '?ngModel', // get a hold of NgModelController
            link: function (scope, elem, attrs, ngModel) {
                var $element = $(elem);
                if (scope.usernameReadOnly) {
                    // always valid for read only case
                    ngModel.$setValidity('username', true);
                } else {
                    var onSuccessUserLoad = function (data) {
                        console.dir(data);
                        console.log(data.length);
                        // set validity
                        ngModel.$setValidity('username', data.length === 0);
                    };
                    var onErrorUserLoad = function (data) {
                        console.log('ERROR');
                    };
                    if (!ngModel) return; // do nothing if no ng-model

                    // watch own value and re-validate on change
                    scope.$watch(attrs.ngModel, function () {
                        validate();
                    });

                    var validate = function () {
                        // values
                        var val1 = ngModel.$viewValue;
                        userService.findUserByUsername(val1).success(onSuccessUserLoad).error(onErrorUserLoad);

                    };
                }
            }
        }
    }]);


/**
 * @name intitialfocus
 * @description Directive to set the focus to the first writable element with the attribute 'initialfocus'
 * @function imageUrlFilter
 * @memberOf angular_app.AppModule
 */
lnkApp.directive('initialfocus',
    function ($timeout) {
        return {
//        restrict: 'A', // only activate on element attribute
            require: '?ngModel', // get a hold of NgModelController
            link: function (scope, elem, attrs, document) {
                if (elem) {
                    $timeout(function(){
                        var $element = $(elem);
                        var readOnlyVal = $element.attr('ng-readonly');
                        if (!readOnlyVal || readOnlyVal == 'false') {
                            if(!scope.initialFocusSet) {
                                scope.initialFocusSet = true;
                                var x = window.scrollX, y = window.scrollY;
                                // set focus
                                $element.first().focus();
                                // restore scroll position to avoid scrolling
                                window.scrollTo(x, y);
                            }
                        }
                    });

                }
            }
        }
    });