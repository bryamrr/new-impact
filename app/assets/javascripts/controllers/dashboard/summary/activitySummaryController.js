angular.module("myapp").controller("ActivitySummaryController", ActivitySummaryController);

ActivitySummaryController.$inject = ['$scope', 'HttpRequest', 'urls'];

function ActivitySummaryController($scope, HttpRequest, urls) {

  $scope.queryDone = false;
  $scope.filter = {};

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
      // $scope.queryDone = true;
      $scope.isLoading = false;
      dataPerPlace = [];

      $scope.dataFiltered = response;

      $scope.prepareData();
      console.log(JSON.stringify(response));
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
  }

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

}