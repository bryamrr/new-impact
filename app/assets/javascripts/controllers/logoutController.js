angular.module("myapp").controller("LogoutController", LogoutController);

LogoutController.$inject = ['$scope', '$state', 'CookieService', 'HttpRequest', 'urls'];
function LogoutController($scope, $state, CookieService, HttpRequest, urls){
  $scope.logout = function() {
    var url = urls.BASE_API + '/users/logout';
    var data = {token: CookieService.read('token')};
    var promesa = HttpRequest.send("POST", url, data);
    promesa.then(function (data) {
      CookieService.remove('token');
      CookieService.remove('nickname');
      CookieService.remove('role');
      console.log("test");
      $state.go('auth.login');
    }, function(error){
      CookieService.remove('token');
      CookieService.remove('nickname');
      CookieService.remove('role');
      $state.go('auth.login');
    });
  }
}