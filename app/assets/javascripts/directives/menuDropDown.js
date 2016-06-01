angular.module("myapp").directive("menuDropDown", menuDropDown);

function menuDropDown(){
  return {
    restrict: "AE",
    scope: {},
    controller: "LogoutController",
    link: function(scope, el, attr){

    },
    template: '' +
    '<md-menu md-position-mode="target-right target">'+
    '    <md-button ng-click="$mdOpenMenu()" aria-label="Configuraciones" class="md-icon-button">'+
    '       <div layout="row">'+
    '            <i md-menu-align-target md-menu-origin class="fa fa-cog fa-2x">'+
    '            </i>'+
    '        </div>'+
    '    </md-button>'+
    '    <md-menu-content width="4">'+
    '      <md-menu-item>'+
    '        <md-button ng-href="#/mis-datos/datos-personales">'+
    '            <span class="helper"></span><!--'+
    '            --><span class="display-inline" md-menu-align-target>Mis datos</span>'+
    '        </md-button>'+
    '      </md-menu-item>'+
    '      <md-menu-divider></md-menu-divider>'+
    '      <md-menu-item>'+
    '         <md-button ng-click="logout()" aria-label="Salir">'+
    '            <span class="helper"></span><!--'+
    '               --><div class="display-inline width-100">'+
    '                 <div layout="row">'+
    '                     <p flex>Salir</p>'+
    '                 </div>'+
    '              </div>'+
    '         </md-button>'+
    '      </md-menu-item>'+
    '    </md-menu-content>'+
    '  </md-menu>'
  }
}