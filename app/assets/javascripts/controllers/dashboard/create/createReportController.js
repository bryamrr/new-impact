angular.module("myapp").controller("CreateReportController", CreateReportController);

CreateReportController.$inject = ['$scope', 'HttpRequest', 'urls', 'CookieService'];

function CreateReportController($scope, HttpRequest, urls, CookieService) {
  var url= urls.BASE_API + '/data_reports/point';
  var promise = HttpRequest.send("GET", url);

  $scope.report = {
    department: -1,
    quantities: {}
  }

  promise.then(function (response){
    $scope.data = response;
    console.log(response)
    var $contenido = $('#contenido');
    $contenido.addClass("loaded");
  }, function(error){
    console.log(error);
  });
}