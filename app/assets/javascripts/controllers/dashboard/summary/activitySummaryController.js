angular.module("myapp").controller("ActivitySummaryController", ActivitySummaryController);

ActivitySummaryController.$inject = ['$scope', 'HttpRequest', 'urls', 'MessagesService'];

function ActivitySummaryController($scope, HttpRequest, urls, MessagesService) {

  $scope.queryDone = false;
  $scope.filter = {};
  $scope.summary = {
    places: [],
    company_name: "",
    company_logo: "",
    activity: ""
  };
  $scope.dataPerPlace = [];
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

      $scope.prepareData();
      console.log($scope.summary);
    }, function(error){
      $scope.isLoading = false;
      MessagesService.display(error.errors, "error");
      console.log(error);
    });
  }

  $scope.prepareData = function () {
    var lonDataFiltered = $scope.dataFiltered.length;
    var currentData = {};

    for (var j = 0; j < $scope.data.activities.length; j++) {
      if ($scope.filter.activity_id == $scope.data.activities[j].id) {
        $scope.summary.activity = $scope.data.activities[j].name;
      }
    }

    if (lonDataFiltered != 0) {
      $scope.summary.company_name = $scope.dataFiltered[0].company.name;
      $scope.summary.company_url = $scope.dataFiltered[0].company.logo_url;
    }

    for (var i = 0; i < lonDataFiltered; i++) {
      currentData = angular.copy($scope.dataFiltered[i]);
      if (currentData.point_details.length != 0) {
        if (dataPerPlace != 0) {
          for (var j = 0; j < dataPerPlace.length; j++) {
            if (currentData.province.name == dataPerPlace[j].name) {
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
    $scope.dataPerPlace = angular.copy(dataPerPlace);
  }

  function addNewPlace(currentData) {
    $scope.summary.places.push(currentData.province.name);

    dataPerPlace.push({
      name: currentData.province.name,
      scope: currentData.point_details[0].scope,
      people: currentData.point_details[0].people,
      sales: parseFloat(currentData.point_details[0].sales),
      company_name: currentData.company.name,
      company_logo: currentData.company.logo_url,
      reports: [
        {
          date: currentData.start_date,
          scope: currentData.point_details[0].scope,
          point: currentData.point_details[0].point,
          people: currentData.point_details[0].people,
          product: currentData.point_details[0].product,
          sales: parseFloat(currentData.point_details[0].sales)
        }
      ]
    });
  }

  function addToPlace(currentData, index) {
    dataPerPlace[index].scope += currentData.point_details[0].scope;
    dataPerPlace[index].people += currentData.point_details[0].people;
    dataPerPlace[index].sales += parseFloat(currentData.point_details[0].sales);

    dataPerPlace[index].reports.push({
      date: currentData.start_date,
      sales: parseFloat(currentData.point_details[0].sales),
      scope: currentData.point_details[0].scope,
      people: currentData.point_details[0].people,
      product: currentData.point_details[0].product,
      point: currentData.point_details[0].point
    });
  }

}