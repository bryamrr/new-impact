angular.module("myapp").controller("CompaniesController", CompaniesController);

CompaniesController.$inject = ['$scope', 'HttpRequest', 'urls', 'MessagesService'];

function CompaniesController($scope, HttpRequest, urls, MessagesService) {

  $scope.newCompany = {
    name: "",
    ruc: "",
    logo_url: ""
  };

  $scope.companies = [];

  var url = urls.BASE_API + '/companies';
  var promise = HttpRequest.send("GET", url);

  promise.then(function (response){
    $scope.companies = response;
    var $contenido = $('#contenido');
    $scope.isLoading = false;
    $contenido.addClass("loaded");
  }, function(error){
    MessagesService.display(error.errors, "error");
    console.log(error);
    $scope.isLoading = false;
  });

  $scope.addLogo = function () {
    $('#photoInput').trigger('click');
  }

  $scope.creds = {
    bucket: 'impactbtl',
    access_key: 'AKIAJI7ULYPNQI4K4UKA',
    secret_key: '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'
  }

  // First, send logo to AmazonS3
  $scope.add = function () {
    $scope.isLoading = true;
    if ($scope.logo) {
      $scope.upload($scope.logo);
    } else {
      $scope.postCompany();
    }
  };

  $scope.upload = function(file) {
    // Configure The S3 Object
    AWS.config.update({ accessKeyId: $scope.creds.access_key, secretAccessKey: $scope.creds.secret_key });
    AWS.config.region = 'us-west-2';
    var bucket = new AWS.S3({ params: { Bucket: $scope.creds.bucket } });

    var params = {Key: file.name, ContentType: file.type, Body: file, forceIframeTransport : true};
    bucket.upload(params, function (err, data) {
      $scope.newCompany.logo_url = data.Location;
      $scope.postCompany();
    });
  };

  $scope.removeItem = function (item, index) {
    item.isLoading = true;

    var url = urls.BASE_API + '/companies/' + item.id;
    var promise = HttpRequest.send("DELETE", url);

    promise.then(function (response){
      $scope.companies.splice(index, 1);
      item.isLoading = false;
    }, function(error){
      console.log(error);
      item.isLoading = false;
    });
  }

  // Then, post company using Rails API
  $scope.postCompany = function () {
    var url = urls.BASE_API + '/companies';

    var promise = HttpRequest.send("POST", url, $scope.newCompany);

    promise.then(function (response){
      $scope.companies.push(response);

      $scope.newCompany = {
        name: "",
        ruc: "",
        logo_url: ""
      };

      $scope.isLoading = false;
    }, function(error){
      $scope.isLoading = false;
      console.log(error);
    });
  }

  function readURL(input) {
    var reader = new FileReader();

    reader.onload = function (e) {
      var html = "<article class='photo' id='photo-inner'><div class='div-photo'><img src='" + e.target.result + "'/></div></article>";

      angular.element(document.getElementById('photo-inner')).remove();
      angular.element(document.getElementById('company-logo')).append(html);
      $scope.logo = input.files[0];
    }

    reader.readAsDataURL(input.files[0]);
  }

  $(document).ready(function() {
    $("#photoInput").change(function() {
      readURL(this);
    });
  });
}