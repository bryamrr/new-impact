angular.module("myapp").service("MessagesService", MessagesService);

MessagesService.$inject = ["$mdToast, toast"];

function MessagesService ($mdToast, toast) {

  console.log("HERE");
  console.log($mdToast);

  // this.messages = {
  //   'LOGIN_SUCCESS': {content: 'Bienvenido a Yachay', typeClass: 'success' },
  //   'LOGIN_UNAUTH': {content: 'Usuario o contraseña incorrecta', typeClass: 'error' },
  //   'LOGIN_FAIL': {content: 'Vuelve a intentarlo', typeClass: 'error' },
  //   'REGISTER_SUCCESS': {content: 'Registro completo', typeClass: 'success'},
  //   'REGISTER_FAIL': {content: 'Hubo un error en el registro', typeClass: 'error'},
  //   'DATA_SUCCESS': {content: 'Cargaron los datos', typeClass: 'success'},
  //   'UPDATE_SUCCESS': {content: 'Se actualizó correctamente', typeClass: 'success'},
  //   'GENERAL_ERROR': {content: 'Vuelve a intentarlo', typeClass: 'error'},
  // };

  // this.display = function (message, delay) {
  //   delay = delay || toast.DELAY;
  //   $mdToast.show(
  //     $mdToast.simple({
  //       controller: 'ToastCtrl',
  //       template: ' '+
  //                 '<md-toast class="custom md-center '+ message.typeClass +'"> '+
  //                 '<span flex>'+ message.content +'</span>'+
  //                 '<md-button class="md-action" ng-click="closeToast()" aria-label="Cerrar">'+
  //                 '   <md-icon md-svg-icon="assets/icons/ic_close_black_24px.svg" ></md-icon>'+
  //                 '  </md-button>'+
  //                 '</md-toast>'
  //     })
  //             .position('top left right')
  //             .hideDelay(delay)
  //   );
  // }
}