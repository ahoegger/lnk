/**
 * Created by aho on 15.09.2014.
 */
var articleServices = angular.module('articleServices', ['ngResource']);

articleServices.factory('articles', ['$resource',
    function($resource){
        return $resource('phones/:phoneId.json', {}, {
            query: {method:'GET', params:{phoneId:'phones'}, isArray:true}
        });
    }]);
