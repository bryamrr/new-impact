angular.module("myapp").controller("LoginController", LoginController);

LoginController.$inject = ['$scope', '$state', 'HttpRequest', 'urls', 'CookieService'];

function LoginController($scope, $state, HttpRequest, urls, CookieService) {

  /* ----------------------------------- */
  /* FORM VALIDATE */
  /* ----------------------------------- */
  $scope.validationOptions = {
    debug: false,
    onkeyup: false,
    rules: {
      user: {
        required: true,
        minlength: 2
      },
      password: {
        required: true,
        minlength: 6
      }
    },
    messages: {
      user: {
        required: 'Ingresa tu usuario',
        minlength: 'Mínimo 2 caracteres'
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

        // $state.go('user.datos');
        $state.reload();
      }
    }, function (error) {
      var server_message = {};
      server_message['typeClass'] = 'error';
      if (error.errors) {
        server_message['content'] = error.errors;
      } else {
        server_message['content'] = "Hubo un problema";
      }
      MessagesService.display(server_message);
    });
  }

}