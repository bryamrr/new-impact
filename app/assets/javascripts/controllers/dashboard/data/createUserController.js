angular.module("myapp").controller("CreateUserController", CreateUserController);

CreateUserController.$inject = ['$scope', 'HttpRequest', 'urls', 'MessagesService'];

function CreateUserController($scope, HttpRequest, urls, MessagesService) {

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
    MessagesService.display(error.errors, "error");
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

  $scope.add = function (form) {
    if(!form.validate() || ($scope.newUser.role_id == 3 && !$scope.newUser.company_id)) {
      MessagesService.display("Falta completar el formulario", "error");
      return false;
    }

    $scope.isLoading = true;

    var url = urls.BASE_API + '/users';
    var promise = HttpRequest.send("POST", url, $scope.newUser);

    promise.then(function (response){
      MessagesService.display("Usuario creado exitosamente", "success");
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
      MessagesService.display(error.errors, "error");
      $scope.isLoading = false;
      console.log(error);
    });
  }

  /* ----------------------------------- */
  /* FORM VALIDATE */
  /* ----------------------------------- */
  $scope.validationOptions = {
    debug: false,
    onkeyup: false,
    rules: {
      nickname: {
        required: true
      },
      password: {
        required: true,
        minlength: 6
      }
    },
    messages: {
      nickname: {
        required: 'Ingrese un nickname'
      },
      password: {
        required: 'Ingresa una contraseña',
        minlength: 'La contraseña debe contener mínimo 6 caracteres'
      }
    },
    highlight: function (element) {
      $(element).parents('md-input-container').addClass('error');
      $(element).parents('form').addClass('error');
      $(element).parent('div').addClass('error');
      $(element).addClass('error');
    },
    unhighlight: function (element) {
      $(element).parents('md-input-container').removeClass('error');
      $(element).parents('form').removeClass('error');
      $(element).parent('div').removeClass('error');
      $(element).removeClass('error');
    },
    errorElement: "div",
    errorClass:'error error-input',
    validClass:'valid valid-input'
  }
}