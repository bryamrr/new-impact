angular.module("myapp").controller("LoginController", LoginController);

LoginController.$inject = ['$scope', '$state', 'HttpRequest', 'urls', 'CookieService', 'MessagesService'];

function LoginController($scope, $state, HttpRequest, urls, CookieService, MessagesService) {

  /* ----------------------------------- */
  /* FORM VALIDATE */
  /* ----------------------------------- */
  $scope.validationOptions = {
    debug: false,
    onkeyup: false,
    rules: {
      user: {
        required: true
      },
      password: {
        required: true,
        minlength: 6
      }
    },
    messages: {
      user: {
        required: 'Ingresa tu usuario'
      },
      password: {
        required: 'Ingresa tu contraseña',
        minlength: 'Mínimo 6 caracteres'
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

  $scope.login = function(form, user, password, $event) {
    if(!form.validate()) return false;

    $scope.isLoading = true;

    var url = urls.BASE_API + "/users/login";
    var data = {
      nick_name: user,
      password: password
    };
    var promesa = HttpRequest.send("POST", url, data);

    promesa.then(function (data) {
      if (data.token) {
        CookieService.put('token', data.token, 1);
        CookieService.put('nickname', data.nick_name, 1);
        CookieService.put('role', data.role, 1);

        MessagesService.display("Bienvenido", "success", 1000);

        $state.reload();
      }
      $scope.isLoading = false;
    }, function (error) {
      MessagesService.display(error.errors, "error");
      $scope.isLoading = false;
    });
  }

}