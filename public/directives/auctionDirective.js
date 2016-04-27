auctionApp.directive('auctionDirective', function () {
    return {
        restrict: 'EA', //E = element, A = attribute, C = class, M = comment         
        // template: '<div>Hello </div>',
        templateUrl: 'templates/auction.html',
        link: function ($scope, element, attrs) { } //DOM manipulation
    }
});