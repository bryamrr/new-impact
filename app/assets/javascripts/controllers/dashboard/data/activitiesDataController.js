angular.module("myapp").controller("ActivitiesDataController", ActivitiesDataController);

ActivitiesDataController.$inject = ['$scope', '$q', 'HttpRequest', 'urls'];

function ActivitiesDataController($scope, $q, HttpRequest, urls) {
  $scope.newActivity = {
    name: "",
    activity_type_id: 1
  };

  $scope.activities = [];

  var urlActivities = urls.BASE_API + '/activities';
  var urlCompanies = urls.BASE_API + '/companies';
  var activitiesPromise = HttpRequest.send("GET", urlActivities);
  var companiesPromise = HttpRequest.send("GET", urlCompanies);

  var allPromise = $q.all([activitiesPromise,companiesPromise]) ;

  allPromise.then(function(data) {
    $scope.activities = data[0];
    $scope.companies = data[1];
    var $contenido = $('#contenido');
    $contenido.addClass("loaded");
  }, function(error){
    var $contenido = $('#contenido');
    $contenido.addClass("loaded");
    console.log(error);
  });

  $scope.add = function () {
    $scope.isLoading = true;

    var url = urls.BASE_API + '/activities';
    var promise = HttpRequest.send("POST", url, $scope.newActivity);

    promise.then(function (response){
      $scope.activities.push(response);

      $scope.newActivity = {
        name: "",
        activity_type_id: 1
      };

      $scope.isLoading = false;
    }, function(error){
      $scope.isLoading = false;
      console.log(error);
    });
  };

  $scope.removeItem = function (item, index) {
    item.isLoading = true;

    var url = urls.BASE_API + '/activities/' + item.id;
    var promise = HttpRequest.send("DELETE", url);

    promise.then(function (response){
      $scope.activities.splice(index, 1);
      item.isLoading = false;
      console.log(response);
    }, function(error){
      console.log(error);
      item.isLoading = false;
    });
  }
}