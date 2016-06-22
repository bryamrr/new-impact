angular.module("myapp").controller("CreateExpenseController", CreateExpenseController);

CreateExpenseController.$inject = ['$scope', '$state', 'urls', 'HttpRequest', 'MessagesService', 'validators'];

function CreateExpenseController($scope, $state, urls, HttpRequest, MessagesService, validators) {
  $scope.expenses = [];
  $scope.report = {
    report_type_id: 1
  };

  var url = urls.BASE_API + '/data_reports/expense';
  var promise = HttpRequest.send("GET", url);

  promise.then(function (response){
    $scope.data = response;
    var $contenido = $('#contenido');
    $contenido.addClass("loaded");
  }, function(error){
    MessagesService.display(error.errors, "error");
    console.log(error);
  });

  $scope.add = function (form) {
    if (!form.validate()) return false
    if (!$scope.newExpense.item_id || !$scope.newExpense.voucher_id) {
      MessagesService.display("Falta seleccionar item o voucher", "error");
      return false;
    }

    for (var i = 0; i < $scope.data.items.length; i++) {
      if ($scope.newExpense.item_id == $scope.data.items[i].id) {
        $scope.newExpense.item_name = $scope.data.items[i].name;
      }
    }

    for (var j = 0; j < $scope.data.vouchers.length; j++) {
      if ($scope.newExpense.voucher_id == $scope.data.vouchers[j].id) {
        $scope.newExpense.voucher_name = $scope.data.vouchers[j].name;
      }
    }

    $scope.expenses.push(angular.copy($scope.newExpense));

    $scope.newExpense = {
      item_id: 1,
      voucher_id: 1,
      total: 0,
      comment: ""
    }

    MessagesService.display("Gasto agregado", "success");
  }

  $scope.removeExpense = function (index) {
    $scope.expenses.splice(index, 1);
  };

  $scope.sendReport = function () {
    if (!$scope.report.company_id || !$scope.report.activity_id || !$scope.report.province_id) {
      MessagesService.display("Falta completar el formulario", "error");
      return false;
    }

    if ($scope.expenses.length == 0) {
      MessagesService.display("Faltan agregar gastos", "error");
      return false;
    }

    $scope.isLoading = true;

    $scope.report.expenses = angular.copy($scope.expenses);

    var url = urls.BASE_API + '/reports';
    var promise = HttpRequest.send("POST", url, $scope.report);

    promise.then(function (response) {
      MessagesService.display("Reporte enviado exitosamente", "success");
      $scope.isLoading = false;
      $state.go("reports.expenses");
    }, function(error){
      MessagesService.display(error.errors, "error");
      $scope.isLoading = false;
    });
  }

  /* ----------------------------------- */
  /* FORM VALIDATE */
  /* ----------------------------------- */
  $scope.validationOptions = {
    debug: false,
    onkeyup: false,
    rules: {
      total: {
        required: true,
        regex: validators.decimal
      }
    },
    messages: {
      total: {
        required: 'Ingresa el total',
        regex: 'Valor total no permitido'
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