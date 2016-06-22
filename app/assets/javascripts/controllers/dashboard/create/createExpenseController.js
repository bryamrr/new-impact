angular.module("myapp").controller("CreateExpenseController", CreateExpenseController);

CreateExpenseController.$inject = ['$scope', 'urls', 'HttpRequest'];

function CreateExpenseController($scope, urls, HttpRequest) {
  $scope.expenses = [];

  var url = urls.BASE_API + '/data_reports/expense';
  var promise = HttpRequest.send("GET", url);

  promise.then(function (response){
    $scope.data = response;
    var $contenido = $('#contenido');
    $contenido.addClass("loaded");
  }, function(error){
    MessagesService.display(error.errors, "error");
    console.log(error);
  });
}