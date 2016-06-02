angular.module("myapp").controller("CreateReportController", CreateReportController);

CreateReportController.$inject = ['$scope', '$timeout', 'HttpRequest', 'urls', 'CookieService'];

function CreateReportController($scope, $timeout, HttpRequest, urls, CookieService) {
  var url = urls.BASE_API + '/data_reports/point';
  var promise = HttpRequest.send("GET", url);

  $scope.report = {
    department: -1,
    product: {},
    merchandising: [],
    personal: [],
    prize: [],
    comment: []
  }

  $scope.newMercha = {};
  $scope.newPersonal = {};
  $scope.photos = [];
  $scope.photosUrl = [];

  var photoSent = 0;

  promise.then(function (response){
    $scope.data = response;
    console.log(response);
    var $contenido = $('#contenido');
    $contenido.addClass("loaded");
  }, function(error){
    console.log(error);
  });

  $scope.addItem = function (item) {
    $scope.report[item].push({});
  }

  $scope.removeItem = function (item, index) {
    $scope.report[item].splice(index, 1);
  }

  $scope.addPhoto = function () {
    $('#photoInput').trigger('click');
  }

  $scope.creds = {
    bucket: 'impactbtl',
    access_key: 'AKIAJI7ULYPNQI4K4UKA',
    secret_key: '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'
  }

  // First, send photos to AmazonS3
  $scope.sendReport = function () {
    $scope.isLoading = true;
    if ($scope.photos[0] != undefined) {
      $scope.upload($scope.photos[0]);
    }
  };

  // Then, post report using Rails API
  $scope.postReport = function () {
    var url= urls.BASE_API + '/data_reports/point';
    var promise = HttpRequest.send("GET", url);

    promise.then(function (response){
      $scope.isLoading = false;
      console.log($scope.photosUrl);
    }, function(error){
      $scope.isLoading = false;
    });
  }

  $scope.upload = function(file) {
    // Configure The S3 Object
    console.log(file);
    AWS.config.update({ accessKeyId: $scope.creds.access_key, secretAccessKey: $scope.creds.secret_key });
    AWS.config.region = 'us-west-2';
    var bucket = new AWS.S3({ params: { Bucket: $scope.creds.bucket } });

    var params = {Key: file.name, ContentType: file.type, Body: file, forceIframeTransport : true};
    bucket.upload(params, function (err, data) {
      console.log("paso", data, err);
      $scope.photosUrl.push(data.Location);
      photoSent++;
      if ($scope.photos[photoSent] != undefined) {
        $scope.upload($scope.photos[photoSent]);
      } else {
        $scope.postReport();
      }
    });
  };

  function readURL(input) {
    var reader = new FileReader();

    reader.onload = function (e) {
      $(input).after("<article><div class='div-photo'><img src='" + e.target.result + "'/><span class='fa-stack'>\
  <i class='fa fa-circle fa-stack-2x'></i>\
  <i class='fa fa-times fa-stack-1x fa-inverse'></i>\
  </span></div></article>");

      $scope.photos.push(input.files[0]);
    }

    reader.readAsDataURL(input.files[0]);
  }

  $(document).ready(function() {
    $("#photoInput").change(function() {
      readURL(this);
    });
  });
}