angular.module("myapp").controller("ShowExpenseReportController", ShowExpenseReportController);

ShowExpenseReportController.$inject = ['$scope', '$stateParams', 'HttpRequest', 'urls'];

function ShowExpenseReportController($scope, $stateParams, HttpRequest, urls) {
  var url = urls.BASE_API + '/reports/' + $stateParams.id;
  var promise = HttpRequest.send("GET", url);

  promise.then(function(data) {
    $scope.report = data;
    var $contenido = $('#contenido');
    $contenido.addClass("loaded");
  }, function(error){
    var $contenido = $('#contenido');
    $contenido.addClass("loaded");
    MessagesService.display(error.errors, "error");
    console.log(error);
  });
}