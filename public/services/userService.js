angular.module('auctionApp').service('$userService', function() {
    var username = "";

    var userDetails = {};
    userDetails = {
        id: 0,
        username: '',
        coins: 0,
        breads: 0,
        carrots: 0,
        diamonds: 0,
        lastlogin: ''
    };
    var setUserDetails = function(userDetail) {
        userDetails = userDetail;
        return userDetails;
    };

    var getUserDetails = function() {
        return userDetails;
    };

    var setUsername = function(user) {
        username = user;
        return username;
    };

    var getUsername = function() {
        return username;
    };


    return {
        getUsername: getUsername,
        setUsername: setUsername,
        setUserDetails: setUserDetails,
        getUserDetails: getUserDetails
    };

});