'use strict';

angular.module('auctionApp.login', ['ngRoute', 'ngMaterial', 'ngMessages'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/login', {
        templateUrl: 'views/login/login.html',
        controller: 'loginCtrl'
    });
}])

.controller('loginCtrl', function($scope, $http, $location, $window , $userService) {

    $scope.submit = function(frmlogin) {
    	if (frmlogin.$invalid) {
            alert('Validation NOT passed ! Enter valid username');
            return;
        }

        // console.log("userService username : " + $userService.username);

        $http({
            method: 'GET',
            url: '/api/v1/login/' + $scope.username
        }).then(function successCallback(response) {
            $userService.setUsername($scope.username);
            sessionStorage.setItem('user', $scope.username);
            $window.location.href = '/#/main';
            return;
        }, function errorCallback(response) {
            console.log(response);
        });
      };



});
