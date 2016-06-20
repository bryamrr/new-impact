angular.module('myapp').config(config);

config.$inject = ['$httpProvider'];
function config($httpProvider) {
  $httpProvider.interceptors.push(['$q', '$location', 'CookieService', function ($q, $location, CookieService) {
    return {
     'request': function (config) {
         config.headers = config.headers || {};
         if (CookieService.read('token')) {
             config.headers.Authorization = 'Bearer ' + CookieService.read('token');
         }
         return config;
     },
     'responseError': function (response) {

         if (response.status === 401 || response.status === 403) {
             CookieService.remove('token');
             CookieService.remove('nickname');
             CookieService.remove('role');
             $location.path('/login');

         }
         return $q.reject(response);

     }
    };
  }]);
}