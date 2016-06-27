angular.module("myapp").controller("EditActivityController", EditActivityController);

EditActivityController.$inject = ['$scope', '$compile', '$q', '$stateParams', '$state', 'HttpRequest', 'urls', 'MessagesService', 'validators'];

function EditActivityController($scope, $compile, $q, $stateParams, $state, HttpRequest, urls, MessagesService, validators) {
  $scope.photos = [];
  $scope.photosUrl = [];

  var photoSent = 0;
  var numPhoto = 0;
  var photoId = [];

  var urlReport = urls.BASE_API + '/reports/' + $stateParams.id;
  var reportPromise = HttpRequest.send("GET", urlReport);

  var urlDataReport = urls.BASE_API + '/data_reports/point';
  var dataReportPromise = HttpRequest.send("GET", urlDataReport);

  var allPromise = $q.all([reportPromise, dataReportPromise]);

  allPromise.then(function(data) {
    $scope.report = data[0];
    $scope.data = data[1];

    prepareData();

    console.log($scope.report);
    var $contenido = $('#contenido');
    $contenido.addClass("loaded");
  }, function(error){
    var $contenido = $('#contenido');
    $contenido.addClass("loaded");
    MessagesService.display(error.errors, "error");
    console.log(error);
  });

  // First, send photos to AmazonS3
  $scope.sendReport = function (form) {
    if(!form.validate()) {
      MessagesService.display("Falta completar el formulario", "error");
      return false;
    }

    $scope.isLoading = true;
    if ($scope.photos[0] != undefined) {
      $scope.upload($scope.photos[0]);
    } else {
      $scope.postReport();
    }
  }

  // Then, post report using Rails API
  $scope.postReport = function () {
    setQuantities();
    setComments();
    setPhotos();

    var url = urls.BASE_API + '/reports/' + $stateParams.id;
    var promise = HttpRequest.send("PATCH", url, $scope.report);

    promise.then(function (response) {
      MessagesService.display("Reporte actualizado exitosamente", "success");
      $scope.isLoading = false;
    }, function(error){
      $scope.isLoading = false;
      MessagesService.display(error.errors, "error");
    });
  }

  $scope.creds = {
    bucket: 'impactbtl',
    access_key: 'AKIAJI7ULYPNQI4K4UKA',
    secret_key: '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'
  }

  $scope.upload = function(file) {
    // Configure The S3 Object
    AWS.config.update({ accessKeyId: $scope.creds.access_key, secretAccessKey: $scope.creds.secret_key });
    AWS.config.region = 'us-west-2';
    var bucket = new AWS.S3({ params: { Bucket: $scope.creds.bucket } });

    var params = {Key: file.name, ContentType: file.type, Body: file, forceIframeTransport : true};
    bucket.upload(params, function (err, data) {
      console.log("paso", data, err);
      $scope.photosUrl.push({
        url: data.Location,
        key: data.Key
      });
      console.log("Ya se añadió en photosUrl")
      photoSent++;
      if ($scope.photos[photoSent] != undefined) {
        $scope.upload($scope.photos[photoSent]);
      } else {
        $scope.postReport();
      }
    });
  };

  $scope.addItem = function (itemList, newItem) {
    if (itemList == 'merchandising') {
      newItem.quantity_type_id = 2;
    } else if (itemList == 'personal') {
      newItem.quantity_type_id = 3;
    } else if (itemList == 'prize') {
      newItem.quantity_type_id = 4;
    }

    if (!$scope.report[itemList]) {
      $scope.report[itemList] = [];
    }
    $scope.report[itemList].push(angular.copy(newItem));
    newItem.name = "";
    newItem.used = undefined;
    newItem.remaining = undefined;
  }

  $scope.removeItem = function (itemList, index) {
    $scope.report[itemList].splice(index, 1);
  }

  $scope.approveReport = function () {
    $scope.isLoadingApprove = true;
    var url = urls.BASE_API + '/approve/' + $stateParams.id;
    var promise = HttpRequest.send("POST", url, $scope.report);

    promise.then(function (response) {
      MessagesService.display("Reporte aprobado", "success");
      $scope.isLoadingApprove = false;
      $state.go("reports.activities");
    }, function(error){
      $scope.isLoadingApprove = false;
      MessagesService.display(error.errors, "error");
    });
  };

  $scope.addPhoto = function () {
    $('#photoInput').trigger('click');
  }

  $scope.removeSavedPhoto = function (index) {
    $scope.report.point_details[0].photos.splice(index, 1);
  };

  function prepareData() {
    $scope.report.presentation = { quantity_type_id: 1 };

    $scope.report.start_date = new Date(Date.parse($scope.report.start_date)).addHours(5);
    $scope.report.end_date = new Date(Date.parse($scope.report.end_date)).addHours(5);


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

      for (var z = 0; z < 5; z++) {
        if ($scope.report.point_details[0].comments[z]) {
          $scope.report.comment[$scope.report.point_details[0].comments[z].comment_type_id - 1] = $scope.report.point_details[0].comments[z].comment;
        }
      }

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
      if ($scope.report.comment[i] && $scope.report.comment[i].trim != "") {
        $scope.report.comments.push({
          comment_type_id: i + 1,
          comment: angular.copy($scope.report.comment[i])
        });
      }
    }
  }

  function setPhotos() {
    $scope.report.photos = [];

    var lonCurrentPhotos = $scope.report.point_details[0].photos.length;
    if (lonCurrentPhotos != 0) {
      for (var j = 0; j < lonCurrentPhotos; j++) {
        $scope.report.photos.push({
          url: angular.copy($scope.report.point_details[0].photos[j].url),
          key: angular.copy($scope.report.point_details[0].photos[j].key)
        })
      }

    }
    if ($scope.photosUrl) {
      var lonPhotos = $scope.photosUrl.length;
      for (var i = 0; i < lonPhotos; i++) {
        $scope.report.photos.push({
          url: angular.copy($scope.photosUrl[i].url),
          key: angular.copy($scope.photosUrl[i].key)
        })
      }
    }
  }

  function readURL(input) {
    var reader = new FileReader();

    reader.onload = function (e) {
      var html = "<article class='photo' id='photo-" + numPhoto + "'><div class='div-photo'><img src='" + e.target.result + "'/><span class='fa-stack' ng-click='removePhoto(" + numPhoto + ")'>\
  <i class='fa fa-circle fa-stack-2x'></i>\
  <i class='fa fa-times fa-stack-1x fa-inverse'></i>\
  </span></div></article>";

      angular.element(document.getElementById('photos')).append($compile(html)($scope));

      $scope.photos.push(input.files[0]);
      photoId[photoId.length] = numPhoto;
      numPhoto++;
      console.log("photos", $scope.photos);
    }

    reader.readAsDataURL(input.files[0]);
  }

  $(document).ready(function() {
    $("#photoInput").change(function() {
      readURL(this);
    });
  });

  /* ----------------------------------- */
    /* FORM VALIDATE */
    /* ----------------------------------- */
    $scope.validationOptions = {
      debug: false,
      onkeyup: false,
      rules: {
        point: {
          required: true
        },
        direct: {
          required: true,
          regex: validators.integer
        },
        indirect: {
          required: true,
          regex: validators.integer
        },
        sales: {
          required: true,
          regex: validators.decimal
        },
        startTime: {
          required: true
        },
        endTime: {
          required: true
        },
        productUsed: {
          regex: validators.integer
        },
        productRemaining: {
          regex: validators.integer
        }
      },
      messages: {
        point: {
          required: 'Ingresa el punto'
        },
        direct: {
          required: 'Ingresa el alcance directo',
          regex: 'Debes ingresar un valor entero'
        },
        indirect: {
          required: 'Ingresa el alcance indirecto',
          regex: 'Debes ingresar un valor entero'
        },
        sales: {
          required: 'Ingresa las ventas',
          regex: 'Debes ingresar un valor válido'
        },
        startTime: {
          required: 'Ingresa la hora de inicio'
        },
        endTime: {
          required: 'Ingresa la hora de cierre'
        },
        productUsed: {
          regex: 'Debes ingresar un valor entero'
        },
        productRemaining: {
          regex: 'Debes ingresar un valor entero'
        }
      },
      highlight: function (element) {
        $(element).parents('md-input-container').addClass('error');
        $(element).parents('form').addClass('error');
        $(element).parent('div').addClass('error');
        $(element).addClass('error');
      },
      unhighlight: function (element) {
        $(element).parents('md-input-container').removeClass('error');
        $(element).parents('form').removeClass('error');
        $(element).parent('div').removeClass('error');
        $(element).removeClass('error');
      },
      errorElement: "div",
      errorClass:'error error-input',
      validClass:'valid valid-input'
    }

    Date.prototype.addHours= function(h){
      this.setHours(this.getHours()+h);
      return this;
    }
}