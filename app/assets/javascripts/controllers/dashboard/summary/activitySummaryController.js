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
  var allPhotos = [];

  $scope.creds = {
    bucket: 'impactbtl',
    access_key: 'AKIAJI7ULYPNQI4K4UKA',
    secret_key: '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'
  }

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
      if (allPhotos[0]) $scope.downloadPhotos(0);
    }, function(error){
      $scope.isLoading = false;
      MessagesService.display(error.errors, "error");
      console.log(error);
    });
  }

  $scope.downloadSummary = function () {
    // $scope.isLoadingImage = true;
    $("#wrapper.header-fixed #contenido").css("overflow-x", "visible");
    var target = $('#final-summary');
    html2canvas(target, {
      onrendered: function(canvas) {
        return Canvas2Image.saveAsJPEG(canvas);
      }
    });
    $("#wrapper.header-fixed #contenido").css("overflow-x", "hidden");
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
              break;
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

    var commentsData = angular.copy(currentData.point_details[0].comments);
    var currentComments = [];

    for (var i = 0; i < commentsData.length; i++) {
      currentComments.push(commentsData[i].comment);
    }

    var photosData = angular.copy(currentData.point_details[0].photos);
    var currentPhotos = [];

    for (var j = 0; j < photosData.length; j++) {
      currentPhotos.push(photosData[j]);
      allPhotos.push(photosData[j]);
    }

    dataPerPlace.push({
      name: currentData.province.name,
      scope: currentData.point_details[0].scope,
      people: currentData.point_details[0].people,
      sales: parseFloat(currentData.point_details[0].sales),
      company_name: currentData.company.name,
      company_logo: currentData.company.logo_url,
      comments: currentComments,
      photos: currentPhotos,
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
    var commentsData = angular.copy(currentData.point_details[0].comments);
    var currentComments = [];

    for (var i = 0; i < commentsData.length; i++) {
      currentComments.push(commentsData[i].comment);
    }

    var photosData = angular.copy(currentData.point_details[0].photos);
    var currentPhotos = [];

    for (var j = 0; j < photosData.length; j++) {
      currentPhotos.push(photosData[j]);
      allPhotos.push(photosData[j]);
    }

    dataPerPlace[index].scope += currentData.point_details[0].scope;
    dataPerPlace[index].people += currentData.point_details[0].people;
    dataPerPlace[index].sales += parseFloat(currentData.point_details[0].sales);
    dataPerPlace[index].comments.push.apply(dataPerPlace[index].comments, currentComments);
    dataPerPlace[index].photos.push.apply(dataPerPlace[index].photos, currentPhotos);

    dataPerPlace[index].reports.push({
      date: currentData.start_date,
      sales: parseFloat(currentData.point_details[0].sales),
      scope: currentData.point_details[0].scope,
      people: currentData.point_details[0].people,
      product: currentData.point_details[0].product,
      point: currentData.point_details[0].point
    });
  }

  $scope.downloadPhotos = function(index) {
    if (!allPhotos[index]) return;

    AWS.config.update({ accessKeyId: $scope.creds.access_key, secretAccessKey: $scope.creds.secret_key });
    AWS.config.region = 'us-west-2';
    var bucket = new AWS.S3({ params: { Bucket: $scope.creds.bucket } });

    if (allPhotos[index].key) {
      var photo = angular.copy(allPhotos[index]);
      bucket.getObject(
        { Key: allPhotos[index].key },
        function (error, data) {
          if (error != null) {
            console.log("Failed to retrieve an object: " + error);
          } else {
            console.log("Loaded " + data.ContentLength + " bytes");
            // do something with data.body
            console.log(data);
            $("#" + photo.id).attr('src', "data:image/jpg;base64," + encode(data.Body));
            $scope.downloadPhotos(index+1);
          }
        }
      );
    } else {
      $scope.downloadPhotos(index+1);
    }
  }

  function encode(data) {
    var str = data.reduce(function(a,b){ return a+String.fromCharCode(b) },'');
    return btoa(str).replace(/.{76}(?=.)/g,'$&\n');
  }

}