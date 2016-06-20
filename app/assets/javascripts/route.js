angular.module("myapp").config(routes);

routes.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];
function routes($stateProvider, $urlRouterProvider, $locationProvider) {
  $stateProvider
    .state('auth',{
      url: '/dashboard/',
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

    // User
    .state('user',{
      url: '/dashboard/user',
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
          templateUrl: 'dashboard/user/data.html',
          controller: 'UserDataController'
        }
      }
    })


    // Create
    .state('create',{
      url: '/dashboard/crear',
      abstract: true,
      data: {
        'needAuth': true,
        'title': 'Crear reportes'
      },
      views: {
        dashboard: {
          templateUrl: 'dashboard/index.html'
        }
      }
    })
    .state('create.activacion',{
      url: '/activacion',
      data: {
        title: 'Activación'
      },
      views: {
        'content@create': {
          templateUrl: 'dashboard/create/activacion.html',
          controller: 'CreateReportController'
        }
      }
    })
    .state('create.campana',{
      url: '/campana',
      data: {
        title: 'Campaña'
      },
      views: {
        'content@create': {
          templateUrl: 'dashboard/create/campana.html',
          controller: 'CreateReportController'
        }
      }
    })
    .state('create.evento',{
      url: '/evento',
      data: {
        title: 'Evento'
      },
      views: {
        'content@create': {
          templateUrl: 'dashboard/create/evento.html',
          controller: 'CreateReportController'
        }
      }
    })
    .state('create.expense',{
      url: '/gasto',
      data: {
        title: 'Gasto'
      },
      views: {
        'content@create': {
          templateUrl: 'dashboard/create/expense.html',
          controller: 'CreateExpenseController'
        }
      }
    })


    // Reports
    .state('reports',{
      url: '/dashboard/reportes',
      abstract: true,
      data: {
        'needAuth': true,
        'title': 'Reportes'
      },
      views: {
        dashboard: {
          templateUrl: 'dashboard/index.html'
        }
      }
    })
    .state('reports.activities',{
      url: '/actividades',
      data: {
        title: 'Actividades'
      },
      views: {
        'content@reports': {
          templateUrl: 'dashboard/reports/activities.html',
          controller: 'ActivityReportsController'
        }
      }
    })
    .state('reports.expenses',{
      url: '/gastos',
      data: {
        title: 'Gastos'
      },
      views: {
        'content@reports': {
          templateUrl: 'dashboard/reports/expenses.html',
          controller: 'ExpenseReportsController'
        }
      }
    })
    .state('reports.activities.edit',{
      url: '/:id',
      data: {
        title: 'Editar'
      },
      views: {
        'content@reports': {
          templateUrl: 'dashboard/reports/edit-activity.html',
          controller: 'EditActivityController'
        }
      }
    })


    // Summary
    .state('summary',{
      url: '/dashboard/informes',
      abstract: true,
      data: {
        'needAuth': true,
        'title': 'Informes'
      },
      views: {
        dashboard: {
          templateUrl: 'dashboard/index.html'
        }
      }
    })
    .state('summary.activities',{
      url: '/actividades',
      data: {
        title: 'Actividades'
      },
      views: {
        'content@summary': {
          templateUrl: 'dashboard/summary/activities.html',
          controller: 'ActivitySummaryController'
        }
      }
    })
    .state('summary.expenses',{
      url: '/gastos',
      data: {
        title: 'Gastos'
      },
      views: {
        'content@summary': {
          templateUrl: 'dashboard/summary/expenses.html',
          controller: 'ExpenseSummaryController'
        }
      }
    })


    // Stats
    .state('stats',{
      url: '/dashboard/metricas',
      abstract: true,
      data: {
        'needAuth': true,
        'title': 'Métricas'
      },
      views: {
        dashboard: {
          templateUrl: 'dashboard/index.html'
        }
      }
    })
    .state('stats.activities',{
      url: '/actividades',
      data: {
        title: 'Actividades'
      },
      views: {
        'content@stats': {
          templateUrl: 'dashboard/stats/activities.html',
          controller: 'ActivityStatsController'
        }
      }
    })
    .state('stats.expenses',{
      url: '/gastos',
      data: {
        title: 'Gastos'
      },
      views: {
        'content@stats': {
          templateUrl: 'dashboard/stats/expenses.html',
          controller: 'ExpenseStatsController'
        }
      }
    })


    // Data
    .state('data',{
      url: '/dashboard/datos',
      abstract: true,
      data: {
        'needAuth': true,
        'title': 'Base de datos'
      },
      views: {
        dashboard: {
          templateUrl: 'dashboard/index.html'
        }
      }
    })
    .state('data.users',{
      url: '/usuarios',
      data: {
        title: 'Lista de usuarios'
      },
      views: {
        'content@data': {
          templateUrl: 'dashboard/data/users.html',
          controller: 'UsersController'
        }
      }
    })
    .state('data.create',{
      url: '/crear-usuario',
      data: {
        title: 'Crear usuario'
      },
      views: {
        'content@data': {
          templateUrl: 'dashboard/data/create-user.html',
          controller: 'CreateUserController'
        }
      }
    })
    .state('data.companies',{
      url: '/companias',
      data: {
        title: 'Compañía'
      },
      views: {
        'content@data': {
          templateUrl: 'dashboard/data/companies.html',
          controller: 'CompaniesController'
        }
      }
    })
    .state('data.activities',{
      url: '/actividades',
      data: {
        title: 'Actividades'
      },
      views: {
        'content@data': {
          templateUrl: 'dashboard/data/activities.html',
          controller: 'ActivitiesDataController'
        }
      }
    });

  // default fall back route
  $urlRouterProvider.otherwise('/dashboard/login');

  // enable HTML5 Mode for SEO
  $locationProvider.html5Mode(true);
}