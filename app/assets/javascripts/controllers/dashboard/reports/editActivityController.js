angular.module("myapp").controller("EditActivityController", EditActivityController);

EditActivityController.$inject = ['$scope', '$q', '$stateParams', '$state', 'HttpRequest', 'urls', 'MessagesService', 'validators'];

function EditActivityController($scope, $q, $stateParams, $state, HttpRequest, urls, MessagesService, validators) {
  var urlReport = urls.BASE_API + '/reports/' + $stateParams.id;
  var reportPromise = HttpRequest.send("GET", urlReport);

  var urlDataReport = urls.BASE_API + '/data_reports/point';
  var dataReportPromise = HttpRequest.send("GET", urlDataReport);

  var allPromise = $q.all([reportPromise, dataReportPromise]);

  allPromise.then(function(data) {
    $scope.report = data[0];
    $scope.data = data[1];

    prepareData();

    var $contenido = $('#contenido');
    $contenido.addClass("loaded");
  }, function(error){
    var $contenido = $('#contenido');
    $contenido.addClass("loaded");
    MessagesService.display(error.errors, "error");
    console.log(error);
  });

  $scope.sendReport = function (form) {
    if(!form.validate()) {
      MessagesService.display("Falta completar el formulario", "error");
      return false;
    }

    setQuantities();
    setComments();

    var url = urls.BASE_API + '/reports/' + $stateParams.id;
    var promise = HttpRequest.send("PATCH", url, $scope.report);

    promise.then(function (response) {
      MessagesService.display("Reporte actualizado exitosamente", "success");
      $scope.isLoading = false;
      $state.go("reports.activities");
    }, function(error){
      $scope.isLoading = false;
      MessagesService.display(error.errors, "error");
    });
  }

  $scope.addItem = function (itemList, newItem) {
    if (itemList == 'merchandising') {
      newItem.quantity_type_id = 2;
    } else if (itemList == 'personal') {
      newItem.quantity_type_id = 3;
    } else if (itemList == 'prize') {
      newItem.quantity_type_id = 4;
    }

    if (!$scope.report[itemList]) {
      $scope.report[itemList] = [];
    }
    $scope.report[itemList].push(angular.copy(newItem));
    newItem.name = "";
    newItem.used = undefined;
    newItem.remaining = undefined;
  }

  $scope.removeItem = function (itemList, index) {
    $scope.report[itemList].splice(index, 1);
  }

  $scope.approveReport = function () {
    var url = urls.BASE_API + '/approve/' + $stateParams.id;
    var promise = HttpRequest.send("POST", url, $scope.report);

    promise.then(function (response) {
      MessagesService.display("Reporte aprobado", "success");
      $scope.isLoading = false;
      $state.go("reports.activities");
    }, function(error){
      $scope.isLoading = false;
      MessagesService.display(error.errors, "error");
    });
  };

  function prepareData() {
    $scope.report.presentation = { quantity_type_id: 1 };

    $scope.report.start_date = new Date(Date.parse($scope.report.start_date));
    $scope.report.end_date = new Date(Date.parse($scope.report.end_date));


    if ($scope.report.point_details.length != 0) {

      $scope.report.presentation.name = $scope.report.point_details[0].product;

      $scope.report.point_detail_id = $scope.report.point_details[0].id;

      $scope.report.activity_mode_id = $scope.report.point_details[0].activity_mode_id;
      $scope.report.point = $scope.report.point_details[0].point;
      $scope.report.scope = $scope.report.point_details[0].scope;
      $scope.report.people = $scope.report.point_details[0].people;
      $scope.report.sales = $scope.report.point_details[0].sales;

      $scope.report.start_time = new Date(Date.parse($scope.report.point_details[0].start_time));
      $scope.report.end_time = new Date(Date.parse($scope.report.point_details[0].end_time));

      if ($scope.report.point_details[0].quantities.length != 0) {
        $scope.report.presentation.name = $scope.report.point_details[0].quantities[0].name;
        $scope.report.presentation.used = $scope.report.point_details[0].quantities[0].used;
        $scope.report.presentation.remaining = $scope.report.point_details[0].quantities[0].remaining;

        for (var i = 1; i < $scope.report.point_details[0].quantities.length; i++) {
          if ($scope.report.point_details[0].quantities[i].quantity_type_id == 2) {
            if (!$scope.report.merchandising) {
              $scope.report.merchandising = [];
            }
            $scope.report.merchandising.push(angular.copy($scope.report.point_details[0].quantities[i]));
          } else if ($scope.report.point_details[0].quantities[i].quantity_type_id == 3) {
            if (!$scope.report.personal) {
              $scope.report.personal = [];
            }
            $scope.report.personal.push(angular.copy($scope.report.point_details[0].quantities[i]));
          } else if ($scope.report.point_details[0].quantities[i].quantity_type_id == 4) {
            if (!$scope.report.prize) {
              $scope.report.prize = [];
            }
            $scope.report.prize.push(angular.copy($scope.report.point_details[0].quantities[i]));
          }
        }
      }

      $scope.report.comment = [];

      for (var z = 0; z < 5; z++) {
        if ($scope.report.point_details[0].comments[z]) {
          $scope.report.comment[$scope.report.point_details[0].comments[z].comment_type_id - 1] = $scope.report.point_details[0].comments[z].comment;
        }
      }

    }
  }

  function setQuantities() {
    $scope.report.quantities = [];

    if (!$scope.report.merchandising) {
      $scope.report.merchandising = [];
    }
    if (!$scope.report.personal) {
      $scope.report.personal = [];
    }
    if (!$scope.report.prize) {
      $scope.report.prize = [];
    }

    var lonMercha = $scope.report.merchandising.length;
    var lonPersonal = $scope.report.personal.length;
    var lonPrices = $scope.report.prize.length;

    $scope.report.product = angular.copy($scope.report.presentation.name);

    $scope.report.quantities.push(angular.copy($scope.report.presentation));

    if (lonMercha != 0) {
      for (var i = 0; i < lonMercha; i++) {
        $scope.report.quantities.push(angular.copy($scope.report.merchandising[i]));
      }
    }

    if (lonPersonal != 0) {
      for (var j = 0; j < lonPersonal; j++) {
        $scope.report.quantities.push(angular.copy($scope.report.personal[j]));
      }
    }

    if (lonPrices != 0) {
      for (var k = 0; k < lonPrices; k++) {
        $scope.report.quantities.push(angular.copy($scope.report.prize[k]));
      }
    }
  }

  function setComments() {
    $scope.report.comments = [];

    var lonComments = 5;

    for (var i = 0; i < lonComments; i++) {
      if ($scope.report.comment[i] && $scope.report.comment[i].trim != "") {
        $scope.report.comments.push({
          comment_type_id: i + 1,
          comment: angular.copy($scope.report.comment[i])
        });
      }
    }
  }

  /* ----------------------------------- */
    /* FORM VALIDATE */
    /* ----------------------------------- */
    $scope.validationOptions = {
      debug: false,
      onkeyup: false,
      rules: {
        point: {
          required: true
        },
        direct: {
          required: true,
          regex: validators.integer
        },
        indirect: {
          required: true,
          regex: validators.integer
        },
        sales: {
          required: true,
          regex: validators.decimal
        },
        startTime: {
          required: true
        },
        endTime: {
          required: true
        },
        productUsed: {
          regex: validators.integer
        },
        productRemaining: {
          regex: validators.integer
        }
      },
      messages: {
        point: {
          required: 'Ingresa el punto'
        },
        direct: {
          required: 'Ingresa el alcance directo',
          regex: 'Debes ingresar un valor entero'
        },
        indirect: {
          required: 'Ingresa el alcance indirecto',
          regex: 'Debes ingresar un valor entero'
        },
        sales: {
          required: 'Ingresa las ventas',
          regex: 'Debes ingresar un valor válido'
        },
        startTime: {
          required: 'Ingresa la hora de inicio'
        },
        endTime: {
          required: 'Ingresa la hora de cierre'
        },
        productUsed: {
          regex: 'Debes ingresar un valor entero'
        },
        productRemaining: {
          regex: 'Debes ingresar un valor entero'
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