angular.module("myapp").controller("ToasterController", ToasterController);

ToasterController.$inject = ['$scope', '$mdToast'];

function ToasterController($scope, $mdToast) {
  $scope.closeToast = function() {
    $mdToast.hide();
  };
};