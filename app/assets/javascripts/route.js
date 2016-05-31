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
    })
    .state('user',{
      url: '/user',
      abstract: true,
      data: {
        'needAuth': true,
        'title': 'Mis datos'
      },
      views: {
        dashboard: {
          templateUrl: 'dashboard/index.html'
        }
      }
    })
    .state('user.datos',{
      url: '/datos',
      data: {
        title: 'Datos personales'
      },
      views: {
        'content@user': {
          templateUrl: 'dashboard/datos/datos.html',
          controller: 'DatosController'
        }
      }
    });

  // default fall back route
  $urlRouterProvider.otherwise('/login');

  // enable HTML5 Mode for SEO
  $locationProvider.html5Mode(true);
}