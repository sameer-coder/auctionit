'use strict';

angular.module('auctionApp.main', ['ngRoute'])

.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/main', {
            templateUrl: 'views/main/main.html',
            controller: 'mainCtrl'
        });
    }
])

.controller('mainCtrl', function($scope, $http, $location, $window, $userService, $mdDialog, $mdToast) {

    var socket = io.connect('http://localhost:3000');

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

    $scope.auction_status = "No Auction"

    $scope.auction_seller = "";
    $scope.auction_item = "";
    $scope.auction_quantity = 0;
    $scope.auction_left = "";
    $scope.auction_winning = "";
    $scope.auction_starttime = "";
    $scope.auction_bidprice = "";

    $scope.isAuctionOn = function() {

    }

    $scope.inventory = ['breads', 'carrots', 'diamonds'];

    $scope.$watch(function() {
        return window.seller
    }, function(newVal, oldVal) {
        if (typeof newVal !== 'undefined') {
            $scope.auction_seller = window.seller;
        }
    });

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


    $scope.auctionStarted = function(auction_item, auction_quantity, auction_bidprice) {
        //clicked the start auction button on dialog
        console.log("sending auction details")

        $mdDialog.hide();

        var t = new Date();
        var postAuction = {}
        postAuction.username = $scope.username;
        postAuction.bidprice = auction_bidprice;
        postAuction.qty = auction_quantity;
        postAuction.item = auction_item;
        postAuction.start_time = t;
        t.setSeconds(t.getSeconds() + 90)
        postAuction.end_time = t;


        console.log("end time : " + postAuction.end_time);


        $http.post("/api/v1/updateCurrentAuction/", postAuction).then(function successCallback(data, status) {
            console.log(data.data.errorMessage)
            if (data.data.errorMessage == "auction_in_progress") {
                alert("Auction already in progress. Please try later")
                return;
            } else {
                alert("Auction started")

                $scope.auction_seller = postAuction.username;
                $scope.auction_item = postAuction.bidprice;
                $scope.auction_quantity = postAuction.qty;
                $scope.auction_winning = postAuction.item;
                $scope.auction_starttime = postAuction.start_time;
                $scope.auction_bidprice = postAuction.end_time;

                socket.emit('SendcurrentAuctionDetails', {
                    my: 'data'
                });


            }
        }, function errorCallback(response) {
            console.log(response);
        });


    };


    $scope.Cancel = function() {
        $mdDialog.hide();
    }

    $scope.startAuction = function(evt, item) {
        $scope.auction_item = item;
        $mdDialog.show({
            locals: {
                Cancel: $scope.Cancel,
                auctionStarted: $scope.auctionStarted,
                auction_item: item,
                auction_bidprice: $scope.auction_bidprice,
                auction_quantity: $scope.auction_quantity
            },
            clickOutsideToClose: true,
            templateUrl: '/templates/auctionDialog.html',
            // onComplete: afterShowAnimation,
            controller: ['$scope', 'auctionStarted', 'Cancel', 'auction_bidprice', 'auction_quantity', 'auction_item',
                function($scope, auctionStarted, Cancel, auction_bidprice, auction_quantity, auction_item) {
                    console.log("in controller")
                    $scope.auctionStarted = auctionStarted;
                    $scope.Cancel = Cancel;
                    $scope.auction_bidprice = auction_bidprice;
                    $scope.auction_quantity = auction_quantity;
                    $scope.auction_item = auction_item;
                }
            ]
        });
    }

    //socket.io code


    socket.on('init_message', function(data) {
        console.log('init_message' + data);

        console.log("Requesting current_auction")
        socket.emit('SendcurrentAuctionDetails', {
            my: 'data'
        });
    });

    socket.on('currentAuctionDetails', function(data) {
        console.log('currentAuctionDetails');
        console.log(data[0]);
        if (data[0] == undefined) {
            $scope.auction_status = "No Auction";
            $scope.auction_seller = ""
            $scope.auction_quantity = 0
            $scope.auction_left = ""

            $scope.auction_item = ""
            $scope.auction_bidprice = ""
            $scope.$apply();
        }

        if (data == "no_auction" || data.length < 1) {
            $scope.isAuctionOn = false;
        } else {
            if (data[0].seller != undefined) {
                $scope.auction_status = "Ongoing Auction";
                console.log($scope.auction_seller)
                console.log(data[0].seller)
                $scope.auction_seller = data[0].seller;
                $scope.auction_quantity = data[0].qty;
                $scope.auction_left = String(((new Date() - new Date(Date.parse(String(data[0].end_time)))) / 1000)).replace('-', '') + "seconds";

                $scope.auction_item = data[0].item;
                $scope.auction_bidprice = data[0].bid;
                $scope.$apply();
            }
        }
    });

});