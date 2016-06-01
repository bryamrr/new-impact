angular.module("myapp").directive("btnNavbar", btnNavbar);

btnNavbar.$inject = ['$timeout', '$log'];
function btnNavbar($timeout, $log){
  return {
    restrict: "A",
    link: function (scope, ele, attr) {
      $timeout(function () {
        var wrapper = $("#wrapper");

        ele.on("click", function () {
          if(!wrapper.hasClass("aside-collapsed")){
            wrapper.addClass("aside-collapsed");
            wrapper.addClass("aside-collapsed-mobile");
          }else{
            wrapper.removeClass("aside-collapsed");
            wrapper.removeClass("aside-collapsed-mobile");
          }
        });
      });
    }
  }
}