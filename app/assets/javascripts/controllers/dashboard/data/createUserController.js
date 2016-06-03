angular.module("myapp").controller("CreateUserController", CreateUserController);

CreateUserController.$inject = ['$scope', 'HttpRequest', 'urls'];

function CreateUserController($scope, HttpRequest, urls) {

  $scope.newUser = {
    nick_name: "",
    password: "",
    email: "",
    role_id: 2,
    phone: "",
    address: ""
  };

  var url = urls.BASE_API + '/data_reports/point';
  var promise = HttpRequest.send("GET", url);

  promise.then(function (response){
    $scope.data = response;
    console.log(response);
    var $contenido = $('#contenido');
    $contenido.addClass("loaded");
  }, function(error){
    console.log(error);
  });

  $scope.generateRandom = function () {
    var chars = "abcdefghijklmnopqrstuvwxyz1234567890";
    var pass = "";
    for (var x = 0; x < 6; x++) {
        var i = Math.floor(Math.random() * chars.length);
        pass += chars.charAt(i);
    }
    $scope.newUser.password = pass;
  };

  $scope.add = function () {
    $scope.isLoading = true;

    var url = urls.BASE_API + '/users';
    var promise = HttpRequest.send("POST", url, $scope.newUser);

    promise.then(function (response){
      alert("Usuario creado");
      $scope.newUser = {
        nick_name: "",
        password: "",
        email: "",
        role_id: 2,
        phone: "",
        address: ""
      };
      $scope.isLoading = false;
      console.log(response);
    }, function(error){
      $scope.isLoading = false;
      console.log(error);
    });
  }
}