angular.module("myapp").controller("CompaniesController", CompaniesController);

CompaniesController.$inject = ['$scope', 'HttpRequest', 'urls'];

function CompaniesController($scope, HttpRequest, urls) {
  var url = urls.BASE_API + '/companies';
  var promise = HttpRequest.send("GET", url);

  promise.then(function (response){
    $scope.data = response;
    console.log(response);
    var $contenido = $('#contenido');
    $contenido.addClass("loaded");
  }, function(error){
    console.log(error);
  });
}