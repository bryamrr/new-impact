angular.module("myapp").config(configFunction);

configFunction.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];
function configFunction($stateProvider, $urlRouterProvider, $locationProvider) {
  $stateProvider
   .state('auth',{
     url: '/',
     abstract: true,
     data: {
       'needAuth': false,
     },
     views: {
       login: {
         templateUrl: 'login/index.html'
       },
       'content@auth': {
         templateUrl: 'login/login.html',
         controller: 'LoginController'
       }
     }
   })
   .state('auth.login',{
      url: 'login',
      views: {
       'content@auth': {
         templateUrl: 'login/login.html',
         controller: 'LoginController'
       }
     }
    });

  // default fall back route
  $urlRouterProvider.otherwise('/login');

  // enable HTML5 Mode for SEO
  $locationProvider.html5Mode(true);
}