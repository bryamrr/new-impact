angular.module("myapp").controller("UsersController", UsersController);

UsersController.$inject = ['$scope', 'HttpRequest', 'urls', 'MessagesService'];

function UsersController($scope, HttpRequest, urls, MessagesService) {

  var url = urls.BASE_API + '/users';
  var promise = HttpRequest.send("GET", url);

  promise.then(function(data) {
    $scope.users = data;
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

    var url = urls.BASE_API + '/users/' + item.id;
    var promise = HttpRequest.send("DELETE", url);

    promise.then(function (response){
      $scope.users.splice(index, 1);
      item.isLoading = false;
      MessagesService.display("Usuario eliminado exitosamente", "success", 1000);
    }, function(error){
      MessagesService.display(error.errors, "error");
      console.log(error);
      item.isLoading = false;
    });
  }
}