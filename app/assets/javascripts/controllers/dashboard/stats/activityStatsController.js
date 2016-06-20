angular.module("myapp").controller("ActivityStatsController", ActivityStatsController);

ActivityStatsController.$inject = ['$scope', 'HttpRequest', 'urls', 'MessagesService'];

function ActivityStatsController($scope, HttpRequest, urls, MessagesService) {

  $scope.queryDone = false;
  $scope.filter = {
    department_id: 0
  };
  $scope.serieSelected = [
    { text: 'Ventas', bool: true },
    { text: "Alcance directo", bool: false },
    { text: "Alcance indirecto", bool: false }
  ];
  $scope.chartType = 'bar';

  var sumChecks = 1;
  var dataPerPlace = [];

  var url = urls.BASE_API + '/data_filters/data_summary';
  var promise = HttpRequest.send("GET", url);

  promise.then(function (response){
    $scope.data = response;
    var $contenido = $('#contenido');
    $contenido.addClass("loaded");
  }, function(error){
    MessagesService.display(error.errors, "error");
    console.log(error);
  });

  $scope.filterReports = function () {
    $scope.isLoading = true;

    var url = urls.BASE_API + '/data_filters/summary';
    var promise = HttpRequest.send("POST", url, $scope.filter);

    promise.then(function (response){
      $scope.queryDone = true;
      $scope.isLoading = false;
      dataPerPlace = [];

      $scope.dataFiltered = response;

      $scope.resetChartData();
      $scope.prepareData();
    }, function(error){
      MessagesService.display(error.errors, "error");
      $scope.isLoading = false;
      console.log(error);
    });
  }

  $scope.prepareData = function () {
    var lonDataFiltered = $scope.dataFiltered.length;
    var currentData = {};

    for (var i = 0; i < lonDataFiltered; i++) {
      currentData = angular.copy($scope.dataFiltered[i]);
      if (currentData.point_details.length != 0) {
        if (dataPerPlace != 0) {
          for (var j = 0; j < dataPerPlace.length; j++) {
            if (currentData.province.name == dataPerPlace[j].province) {
              addToPlace(currentData, j);
            } else if (j == dataPerPlace.length - 1) {
              addNewPlace(currentData);
              j++;
            }
          }
        } else {
          addNewPlace(currentData);
        }
      }

    }

    console.log(dataPerPlace);
    $scope.reloadStat();
  }

  $scope.reloadStat = function (bool) {
    if (bool == true) {
      sumChecks++;
    } else if (bool == false) {
      sumChecks--;
    }

    var provinceId = angular.copy($scope.filter.province_id);

    $scope.resetChartData();
    $scope.addSeries();

    if (sumChecks == 0) {
      console.log("Tiene que escoger un elemento de los checks");
    } else if ($scope.filter.department_id != 0 && sumChecks == 1) {
      if ($scope.filter.province_id) {
        $scope.chartType = 'line';
        generateLine();
      }
    } else if ($scope.filter.department_id == 0 && $scope.serieSelected[0].bool && !$scope.serieSelected[1].bool && !$scope.serieSelected[2].bool) {
      $scope.chartType = 'pie';
      generatePie();
    } else {
      $scope.chartType = 'bar';
      for (var i = 0; i < dataPerPlace.length; i++) {
        if ($scope.filter.department_id != 0) {
          if (provinceId == dataPerPlace[i].province_id) {
            addPlaceToBar(dataPerPlace[i]);
          } else if (i == dataPerPlace.length - 1) {
            console.log("No hay datos para la provincia seleccionada");
          }
        } else {
          // Mostrar data de todas las plazas en el informe
          addPlaceToBar(dataPerPlace[i]);
        }
      }
    }
  };

  $scope.addSeries = function () {
    var serieSelected = angular.copy($scope.serieSelected);
    for (var i = 0; i < serieSelected.length; i++) {
      if (serieSelected[i].bool == true) {
        $scope.chart.series.push(serieSelected[i].text);
        $scope.chart.values.push(i);
      }
    }
  };

  $scope.resetChartData = function () {
    $scope.chart = {
      data: [],
      labels: [],
      series: [],
      values: [],
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero:true
            }
          }]
        }
      }
    };
  };

  function addNewPlace(currentData) {
    dataPerPlace.push({
      province: currentData.province.name,
      province_id: currentData.province.id,
      direct: currentData.point_details[0].scope,
      indirect: currentData.point_details[0].people,
      sales: parseFloat(currentData.point_details[0].sales),
      dates: [
        {
          date: currentData.start_date,
          direct: currentData.point_details[0].scope,
          indirect: currentData.point_details[0].people,
          sales: parseFloat(currentData.point_details[0].sales)
        }
      ]
    });
  }

  function addToPlace(currentData, index) {
    dataPerPlace[index].direct += currentData.point_details[0].scope;
    dataPerPlace[index].indirect += currentData.point_details[0].people;
    dataPerPlace[index].sales += parseFloat(currentData.point_details[0].sales);

    for (var i = 0; i < dataPerPlace[index].dates.length; i++) {
      if (dataPerPlace[index].dates[i].date == currentData.start_date) {
        dataPerPlace[index].dates[i].direct += currentData.point_details[0].scope;
        dataPerPlace[index].dates[i].sales += parseFloat(currentData.point_details[0].sales);
        dataPerPlace[index].dates[i].indirect += currentData.point_details[0].people;
      } else if (i == dataPerPlace[index].dates.length - 1) {
        dataPerPlace[index].dates.push({
          date: currentData.start_date,
          sales: parseFloat(currentData.point_details[0].sales),
          direct: currentData.point_details[0].scope,
          indirect: currentData.point_details[0].people
        });
      }
    }
  }

  function addPlaceToBar(place) {
    $scope.chart.labels.push(place.province);
    var chartValue = "";
    for (var i = 0; i < $scope.chart.series.length; i++) {
      if ($scope.chart.data[i] == undefined) {
        $scope.chart.data[i] = [];
      }

      if ($scope.chart.values[i] == 0) {
        chartValue = "sales";
      } else if ($scope.chart.values[i] == 1) {
        chartValue = "direct";
      } else if ($scope.chart.values[i] == 2) {
        chartValue = "indirect";
      }

      $scope.chart.data[i].push(place[chartValue]);
    }
  }

  function generateLine() {
    var indexProvince;
    var dataProvince;
    var chartValue = "";

    for (var i = 0; i < dataPerPlace.length; i++) {
      if (dataPerPlace[i].province_id == $scope.filter.province_id) {
        indexProvince = i;
      }
    }

    var dataProvince = angular.copy(dataPerPlace[indexProvince]);

    if ($scope.chart.values[0] == 0) {
      chartValue = "sales";
    } else if ($scope.chart.values[0] == 1) {
      chartValue = "direct";
    } else if ($scope.chart.values[0] == 2) {
      chartValue = "indirect";
    }

    for (var j = 0; j < dataProvince.dates.length; j++) {
      if ($scope.chart.data[0] == undefined) {
        $scope.chart.data[0] = [];
      }

      $scope.chart.labels.push(dataProvince.dates[j].date);
      $scope.chart.data[0].push(dataProvince.dates[j][chartValue]);
    }

    console.log($scope.chart);
  }

  function generatePie() {
    var lonPlaces = dataPerPlace.length;

    for (var i = 0; i < lonPlaces; i++) {
      $scope.chart.labels.push(dataPerPlace[i].province);
      $scope.chart.data.push(dataPerPlace[i].sales);
    }
  }
}