'use strict';

// Declare app level module which depends on views, and components
var auctionApp = angular.module('auctionApp', [
  'ngRoute',
  'auctionApp.login',
  'auctionApp.main'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.
      otherwise({redirectTo: '/login'});
}]);