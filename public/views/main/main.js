'use strict';

angular.module('auctionApp.main', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/main', {
        templateUrl: 'views/main/main.html',
        controller: 'mainCtrl'
    });
}])

.controller('mainCtrl', function($scope, $http, $location, $window, $userService) {

    $scope.userDetails = {};
    $scope.userDetails = {
        name: '',
        coins: 0,
        breads: 0,
        carrots: 0,
        diamonds: 0
    };

    $scope.username = "test";

    if ($userService.username == undefined) {
        $window.location.href = '/#/login';
        return;
    }

    $scope.username = $userService.username;

    $http({
        method: 'GET',
        url: '/api/v1/getAllWidgets/' + $userService.username
    }).then(function successCallback(response) {

        // console.log($userService);
        //error checking
        console.log("breads : " + response.data.userDetalis[0].breads);
        console.log("c:" + $scope.userDetails);
        $userService.setUserDetails(response.data.userDetalis[0]);

        $scope.userDetails = $userService.getUserDetails();

        $scope.userDetails.coins = $userService.getUserDetails().coins;

        $window.location.href = '/#/main';
        return;
    }, function errorCallback(response) {
        console.log(response);
    });





});
