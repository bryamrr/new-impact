angular.module("myapp").controller("EditActivityController", EditActivityController);

EditActivityController.$inject = ['$scope', '$q', '$stateParams', 'HttpRequest', 'urls'];

function EditActivityController($scope, $q, $stateParams, HttpRequest, urls) {
  var urlReport = urls.BASE_API + '/reports/' + $stateParams.id;
  var reportPromise = HttpRequest.send("GET", urlReport);

  var urlDataReport = urls.BASE_API + '/data_reports/point';
  var dataReportPromise = HttpRequest.send("GET", urlDataReport);

  var allPromise = $q.all([reportPromise, dataReportPromise]);

  allPromise.then(function(data) {
    $scope.report = data[0];
    $scope.data = data[1];

    console.log(data);

    prepareData();

    var $contenido = $('#contenido');
    $contenido.addClass("loaded");
  }, function(error){
    var $contenido = $('#contenido');
    $contenido.addClass("loaded");
    console.log(error);
  });

  $scope.sendReport = function () {
    setQuantities();
    setComments();

    console.log($scope.report);

    var url = urls.BASE_API + '/reports/' + $stateParams.id;
    var promise = HttpRequest.send("PATCH", url, $scope.report);

    promise.then(function (response) {
      alert("Reporte actualizado");
      $scope.isLoading = false;
    }, function(error){
      $scope.isLoading = false;
    });
  }

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
        console.log($scope.report.point_details[0].quantities);
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

      $scope.report.comment[0] = $scope.report.point_details[0].comments[0].comment;
      $scope.report.comment[1] = $scope.report.point_details[0].comments[1].comment;
      $scope.report.comment[2] = $scope.report.point_details[0].comments[2].comment;
      $scope.report.comment[3] = $scope.report.point_details[0].comments[3].comment;
      $scope.report.comment[4] = $scope.report.point_details[0].comments[4].comment;

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
      if ($scope.report.comment[i].trim != "") {
        $scope.report.comments.push({
          comment_type_id: i + 1,
          comment: angular.copy($scope.report.comment[i])
        });
      }
    }
  }
}