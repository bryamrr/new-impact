angular.module("myapp").controller("LoginController", LoginController);

LoginController.$inject = ['$scope'];

function LoginController($scope) {

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
    console.log(user, password);
  }

}