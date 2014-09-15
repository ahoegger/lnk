/**
 * Created by aho on 12.09.2014.
 */
var articlesController = angular.module('articlesController', []);

articlesController.controller('articleListController', ['$scope', '$http',
    function ($scope, $http) {
        $http.get('phones/phones.json').success(function(data) {
            $scope.phones = data;
        });
        $scope.sloagan='a Sloagan';
        $scope.orderProp = 'age';
//        $scope.getTags = function(article){
//          services.getTags(article.tagUrd)
//        };
    }]);

articlesController.controller('navigationController', ['$scope',
    function ($scope) {

        $scope.sloagan2='navigation Sloagan';
    }]);


phonecatControllers.controller('PhoneDetailCtrl', ['$scope', '$routeParams',
    function($scope, $routeParams) {
        $scope.phoneId = $routeParams.phoneId;
    }]);