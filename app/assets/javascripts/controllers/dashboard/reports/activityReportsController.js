angular.module("myapp").controller("ActivityReportsController", ActivityReportsController);

ActivityReportsController.$inject = ['$scope', 'HttpRequest', 'urls', 'MessagesService'];

function ActivityReportsController($scope, HttpRequest, urls, MessagesService) {

  var url = urls.BASE_API + '/reports';
  var promise = HttpRequest.send("GET", url);

  promise.then(function(data) {
    console.log(data);
    $scope.reports = data;
    var $contenido = $('#contenido');
    $contenido.addClass("loaded");
  }, function(error){
    var $contenido = $('#contenido');
    $contenido.addClass("loaded");
    MessagesService.display(error.errors, "error");
    console.log(error);
  });

  $scope.removeItem = function (item, index) {
    item.isLoading = true;

    var url = urls.BASE_API + '/reports/' + item.id;
    var promise = HttpRequest.send("DELETE", url);

    promise.then(function (response){
      MessagesService.display("Reporte eliminado exitosamente", "success", 1000);
      $scope.reports.splice(index, 1);
      item.isLoading = false;
    }, function(error){
      console.log(error);
      MessagesService.display(error.errors, "error");
      item.isLoading = false;
    });
  }
}