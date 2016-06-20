angular.module("myapp").directive("headerBreadCrumb", headerBreadCrumb);

headerBreadCrumb.$inject = ['$state'];
function headerBreadCrumb($state){
  return {
    restrict: "AE",
    scope: {},
    link: function(scope, el, attr){
      el = $(el);

      // parent title
      scope.hasParent = false;
      if(typeof $state.$current.parent.data !== 'undefined'){
        scope.parentTitle = $state.$current.parent.data.title;
        scope.hasParent = true;
      }

      // current title
      scope.currentTitle = $state.$current.data.title;
    },
    template: '' +
              '<div class="page-heading">' +
                '<ol class="breadcrumb">' +
                  '<li>' +
                    '<md-button ui-sref="user.datos" class="md-icon-button" aria-label="Home">' +
                    '<span class="helper"></span><!--' +
                    '--><i class="fa fa-home"></i>' +
                    '</md-button>' +
                  '</li>' +

                  '<li ng-if="hasParent">' +
                    '{{ parentTitle }}' +
                  '</li>' +
                  '<li>' +
                    '<strong>{{ currentTitle }}</strong>' +
                  '</li>' +
                '</ol>' +
              '</div>'
  }
}