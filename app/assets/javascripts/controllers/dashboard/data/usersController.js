angular.module("myapp").controller("UsersController", UsersController);

UsersController.$inject = ['$scope', 'HttpRequest', 'urls'];

function UsersController($scope, HttpRequest, urls) {

  var url = urls.BASE_API + '/users';
  var promise = HttpRequest.send("GET", url);

  promise.then(function(data) {
    $scope.users = data;
    var $contenido = $('#contenido');
    $contenido.addClass("loaded");
  }, function(error){
    var $contenido = $('#contenido');
    $contenido.addClass("loaded");
    console.log(error);
  });

  $scope.removeItem = function (item, index) {
    item.isLoading = true;

    var url = urls.BASE_API + '/users/' + item.id;
    var promise = HttpRequest.send("DELETE", url);

    promise.then(function (response){
      $scope.users.splice(index, 1);
      item.isLoading = false;
    }, function(error){
      console.log(error);
      item.isLoading = false;
    });
  }
}