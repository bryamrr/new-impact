angular.module('myapp').controller('DashboardController', DashboardController)

DashboardController.$inject = ['$scope', 'CookieService'];
function DashboardController($scope, CookieService) {
  $scope.nickname = CookieService.read('nickname');
  $scope.role = CookieService.read('role');
}