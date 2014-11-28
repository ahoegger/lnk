/**
 * Service for token interception to add the JSON web token to the header when doing request
 * @class angular_services.TokenInterceptorServiceModule
 * @memberOf angular_services
 * @author Andy Hoegger
 * @since 12.11.2014
 */
var tokenInterceptorService = angular.module('service.tokenInterceptor', ['service.authentication']);

/**
 * @description Service factory for token interception
 * @function TokenInterceptorService
 * @memberOf angular_services.TokenInterceptorServiceModule
 */
tokenInterceptorService.factory('tokenInterceptor', function ($q, $window, $location, authenticationState) {
    return {
        request: function (config) {
            config.headers = config.headers || {};
            if ($window.sessionStorage.token) {
                config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
            }
            return config;
        },

        requestError: function(rejection) {
            return $q.reject(rejection);
        },

        /* Set Authentication.isAuthenticated to true if 200 received */
        response: function (response) {
            if (response != null && response.status == 200 && $window.sessionStorage.token && !authenticationState.isAuthenticated) {
                authenticationState.isAuthenticated = true;
            }
            return response || $q.when(response);
        },

        /* Revoke client authentication if 401 is received */
        responseError: function(rejection) {
            if (rejection != null && rejection.status === 401 && ($window.sessionStorage.token || authenticationState.isAuthenticated)) {
                delete $window.sessionStorage.token;
                authenticationState.isAuthenticated = false;
                $location.path("/admin/login");
            }

            return $q.reject(rejection);
        }
    };
});