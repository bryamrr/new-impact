angular.module("myapp").controller("ExpenseReportsController", ExpenseReportsController);

ExpenseReportsController.$inject = ['$scope', 'urls', 'HttpRequest'];

function ExpenseReportsController($scope, urls, HttpRequest) {
  var url = urls.BASE_API + '/expenses';
  var promise = HttpRequest.send("GET", url);

  promise.then(function(data) {
    $scope.reports = data;
    var $contenido = $('#contenido');
    $contenido.addClass("loaded");
  }, function(error){
    var $contenido = $('#contenido');
    $contenido.addClass("loaded");
    MessagesService.display(error.errors, "error");
    console.log(error);
  });
}