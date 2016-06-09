angular.module("myapp").controller("ActivityStatsController", ActivityStatsController);

ActivityStatsController.$inject = ['$scope', 'HttpRequest', 'urls'];

function ActivityStatsController($scope, HttpRequest, urls) {

  $scope.queryDone = false;
  $scope.showAllProvinces = true;
  $scope.filter = {};
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
    console.log(error);
  });

  $scope.filterReports = function () {
    $scope.isLoading = true;

    var url = urls.BASE_API + '/data_filters/summary';
    var promise = HttpRequest.send("POST", url, $scope.filter);

    promise.then(function (response){
      $scope.queryDone = true;
      $scope.isLoading = false;

      $scope.dataFiltered = response;

      $scope.resetChartData();
      $scope.prepareData();
    }, function(error){
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

  $scope.reloadStat = function () {
    var provinceId = angular.copy($scope.filter.province_id);

    $scope.resetChartData();
    $scope.addSeries();

    if (!$scope.showAllProvinces && sumChecks == 1) {
      $scope.chartType = 'linea';
    } else {
      $scope.chartType = 'bar';
      for (var i = 0; i < dataPerPlace.length; i++) {
        if (!$scope.showAllProvinces) {
          if (provinceId == dataPerPlace[i].province_id) {
            // Mostrar data de la única plaza
          }
        } else {
          // Mostrar data de todas las plazas en el informe
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
    dataPerPlace[index].direct += currentData.point_details[0].direct;
    dataPerPlace[index].indirect += currentData.point_details[0].indirect;
    dataPerPlace[index].sales += parseFloat(currentData.point_details[0].sales);

    for (var i = 0; i < dataPerPlace[index].dates.length; i++) {
      if (dataPerPlace[index].dates[i].date == currentData.start_date) {
        dataPerPlace[index].dates[i].direct != currentData.point_details[0].direct;
        dataPerPlace[index].dates[i].sales != currentData.point_details[0].sales;
        dataPerPlace[index].dates[i].indirect != currentData.point_details[0].indirect;
      } else if (i == dataPerPlace[index].dates.length - 1) {
        dataPerPlace[index].dates.push({
          date: currentData.start_date,
          sales: currentData.point_details[0].sales,
          direct: currentData.point_details[0].direct,
          indirect: currentData.point_details[0].indirect
        });
      }
    }
  }

}