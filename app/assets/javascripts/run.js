angular
  .module('myapp')
  .run(runBlock);

runBlock.$inject = ['$rootScope', '$state', 'AuthService'];
function runBlock($rootScope, $state, AuthService) {
  $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
    if(!AuthService.isAuthenticated() && toState.data.needAuth) {
      event.preventDefault();
      $state.go('auth.login');
    }
    if(AuthService.isAuthenticated() && !toState.data.needAuth) {
      event.preventDefault();
      $state.go('user.datos');
    }
  });

  $rootScope.$state = $state;
}