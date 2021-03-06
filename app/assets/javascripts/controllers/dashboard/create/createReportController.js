angular.module("myapp").controller("CreateReportController", CreateReportController);

CreateReportController.$inject = ['$scope', '$compile', '$state', 'HttpRequest', 'urls', 'CookieService', 'MessagesService', 'validators'];

function CreateReportController($scope, $compile, $state, HttpRequest, urls, CookieService, MessagesService, validators) {
  $scope.report = {
    report_type_id: 2,
    presentation: {
      quantity_type_id: 1
    },
    merchandising: [],
    personal: [],
    prize: [],
    comment: [],
    quantities: [],
    comments: [],
    photos: []
  }

  $scope.photos = [];
  $scope.photosUrl = [];

  var photoSent = 0;
  var photoId = [];
  var numPhoto = 0;

  var url = urls.BASE_API + '/data_reports/point';
  var promise = HttpRequest.send("GET", url);

  promise.then(function (response){
    $scope.data = response;
    var $contenido = $('#contenido');
    $contenido.addClass("loaded");
  }, function(error){
    MessagesService.display(error.errors, "error");
    console.log(error);
  });

  $scope.addItem = function (itemList, newItem) {
    if (itemList == 'merchandising') {
      newItem.quantity_type_id = 2;
    } else if (itemList == 'personal') {
      newItem.quantity_type_id = 3;
    } else if (itemList == 'prize') {
      newItem.quantity_type_id = 4;
    }
    $scope.report[itemList].push(angular.copy(newItem));
    newItem.name = "";
    newItem.used = undefined;
    newItem.remaining = undefined;
  }

  $scope.removeItem = function (itemList, index) {
    $scope.report[itemList].splice(index, 1);
  }

  $scope.addPhoto = function () {
    $('#photoInput').trigger('click');
  }

  $scope.creds = {
    bucket: 'impactbtl',
    access_key: 'AKIAJI7ULYPNQI4K4UKA',
    secret_key: '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'
  }

  $scope.removePhoto = function (id) {
    $("#photo-" + id).remove();
    for (var i = 0; i < photoId.length; i++) {
      if (photoId[i] == id) {
        $scope.photos.splice(i, 1);
        photoId.splice(i, 1);
      }
    }
  };

  // First, send photos to AmazonS3
  $scope.sendReport = function (form) {
    if(!form.validate() || !$scope.report.company_id || !$scope.report.activity_id || !$scope.report.department_id || !$scope.report.province_id || !$scope.report.start_date || !$scope.report.end_date) {
      MessagesService.display("Falta completar el formulario", "error");
      return false;
    }

    $scope.isLoading = true;
    if ($scope.photos[0] != undefined) {
      $scope.upload($scope.photos[0]);
    } else {
      $scope.postReport();
    }

  };

  // Then, post report using Rails API
  $scope.postReport = function () {
    setQuantities();
    setComments();
    setPhotos();

    var url = urls.BASE_API + '/reports';
    var promise = HttpRequest.send("POST", url, $scope.report);

    promise.then(function (response) {
      MessagesService.display("Reporte creado de forma exitosa", "success");
      $scope.isLoading = false;
      $state.go("reports.activities");
    }, function(error){
      MessagesService.display(error.errors, "error");
      $scope.isLoading = false;
    });
  }

  $scope.upload = function(file) {
    // Configure The S3 Object
    AWS.config.update({ accessKeyId: $scope.creds.access_key, secretAccessKey: $scope.creds.secret_key });
    AWS.config.region = 'us-west-2';
    var bucket = new AWS.S3({ params: { Bucket: $scope.creds.bucket } });
    var filename = file.name + Date.now();

    var params = {Key: filename, ContentType: file.type, Body: file, forceIframeTransport : true};
    bucket.upload(params, function (err, data) {
      console.log("paso", data, err);
      $scope.photosUrl.push({
        url: data.Location,
        key: data.Key
      });
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
      var html = "<article class='photo' id='photo-" + numPhoto + "'><div class='div-photo'><img src='" + e.target.result + "'/><span class='fa-stack' ng-click='removePhoto(" + numPhoto + ")'>\
  <i class='fa fa-circle fa-stack-2x'></i>\
  <i class='fa fa-times fa-stack-1x fa-inverse'></i>\
  </span></div></article>";

      angular.element(document.getElementById('photos')).append($compile(html)($scope));

      $scope.photos.push(input.files[0]);
      photoId[photoId.length] = numPhoto;
      numPhoto++;
    }

    reader.readAsDataURL(input.files[0]);
  }

  function setQuantities() {
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
}