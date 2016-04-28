'use strict';

angular.module('auctionApp.main', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/main', {
        templateUrl: 'views/main/main.html',
        controller: 'mainCtrl'
    });
}])

.controller('mainCtrl', function($scope, $http, $location, $window, $userService, $mdDialog) {

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

    $scope.auction = {};
    $scope.auction_seller = "";
    $scope.auction_item = "";
    $scope.auction_quantity = 0;
    $scope.auction_left = "";
    $scope.auction_winning = "";
    $scope.auction_starttime = "";

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


    // $scope.startAuction = function(ev, item) {
    //     // Appending dialog to document.body to cover sidenav in docs app
    //     var confirm = $mdDialog.prompt()
    //     .clickOutsideToClose(true)
    //         .title('How many ' + item + ' do you want to auction?')
    //         .textContent('Please enter the quantity')
    //         .placeholder('10')
    //         .ariaLabel('10')
    //         .targetEvent(ev)
    //         .ok('Auction It!')
    //         .cancel('No thanks');

    //     $mdDialog.show(confirm).then(function(result) {

    //         //error checking for number

    //         console.log(item);

    //         $scope.auction_quantity = result;
    //         $scope.auction_seller = $scope.username;
    //         $scope.auction_winning = $scope.username;

    //         $scope.auction_starttime = (new Date()).toISOString();

    //         console.log($scope.auction_starttime);

    //         $mdDialog.hide(confirm);
    //         confirm = undefined;

    //     }, function(result) {
    //     }).finally(function() {
    //       });
    // };


    //socket.io code

    var socket = io.connect('http://localhost:3000');
    socket.on('init_message', function(data) {
        console.log('init_message' + data);

        socket.emit('currentAuctionDetails', {
            my: 'data'
        });
    });

});
