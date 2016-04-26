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

        //set the username in service
        $userService.username = $scope.username;

        console.log("userService username : " + $userService.username);

        $http({
            method: 'GET',
            url: '/api/v1/login/' + $scope.username
        }).then(function successCallback(response) {
            console.log(response);
            $window.location.href = '/#/main';
            return;
        }, function errorCallback(response) {
            console.log(response);
        });
      };

    // sessionStorage.user = JSON.stringify({user:"test"});
    $scope.username = "";


});
