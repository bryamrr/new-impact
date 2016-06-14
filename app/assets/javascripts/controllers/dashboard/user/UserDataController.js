
angular.module("myapp").controller("UserDataController", UserDataController);

UserDataController.$inject = ['$scope', 'HttpRequest', 'urls', 'CookieService'];

function UserDataController($scope, HttpRequest, urls, CookieService) {

  var url= urls.BASE_API + '/users/' + CookieService.read("nickname");
  var promise = HttpRequest.send("GET", url);

  promise.then(function (response){
    $scope.user = response;
    var $contenido = $('#contenido');
    $contenido.addClass("loaded");
  }, function(error){
    MessagesService.display(error.errors, "error");
    console.log(error);
  });
}