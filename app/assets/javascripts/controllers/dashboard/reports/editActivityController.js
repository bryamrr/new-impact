angular.module("myapp").controller("EditActivityController", EditActivityController);

EditActivityController.$inject = ['$scope', '$stateParams', 'HttpRequest', 'urls'];

function EditActivityController($scope, $stateParams, HttpRequest, urls) {
  var url = urls.BASE_API + '/reports/' + $stateParams.id;
  var promise = HttpRequest.send("GET", url);

  promise.then(function(data) {
    console.log(data);
    $scope.report = data;
    var $contenido = $('#contenido');
    $contenido.addClass("loaded");
  }, function(error) {
    var $contenido = $('#contenido');
    $contenido.addClass("loaded");
    console.log(error);
  });
}