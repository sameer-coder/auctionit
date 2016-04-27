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
        id: 0,
        username: '',
        coins: 0,
        breads: 0,
        carrots: 0,
        diamonds: 0,
        lastlogin: ''
    };

    $scope.inventory = ['breads', 'carrots', 'diamonds'];


    console.log("$userService.username in main :" + $userService.getUsername());

    if (sessionStorage.user == undefined) {
        $window.location.href = '/#/login';
        return;
    }

    $scope.username = sessionStorage.user;
    $userService.setUsername(sessionStorage.user);

    $http({
        method: 'GET',
        url: '/api/v1/getAllWidgets/' + $userService.getUsername()
    }).then(function successCallback(response) {

        //error checking
        // console.log("breads : " + response.data.userDetalis[0].breads);
        // console.log($scope.userDetails);
        $userService.setUserDetails(response.data.userDetalis[0]);

        $scope.userDetails = $userService.getUserDetails();
        // console.log("post userDetails");
        // console.log($scope.userDetails);

        $window.location.href = '/#/main';
        return;
    }, function errorCallback(response) {
        console.log(response);
    });


    $scope.logout = function() {
        sessionStorage.removeItem('user');
        $window.location.href = '/#/login';
        return;
    }


    //socket.io code

    var socket = io();

    console.log(io);

    io.on('connection', function(socket) {
        socket.on('init_message', function(msg) {
            console.log('message: ' + msg);
        });
    });


});
