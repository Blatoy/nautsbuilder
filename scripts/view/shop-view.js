var ShopView = new function() {
  this.init = function() {
    this.hideShop();
    this.hideBuyOrder();
    $("#build-order").show();
    $("#naut-shop").show();
  };

  this.displayUpgrade = function() {};
  this.displaySkill = function() {};

  this.hideShop = function() {
    $("#naut-shop").css("left", (-$("#naut-shop").outerWidth() - 100) + "px");
  };

  this.hideBuyOrder = function() {
    $("#build-order").css("left", (-$("#build-order").outerWidth() - 100) + "px");
  };

  this.displayShop = function() {
   $("#naut-shop").css("left", "0px");
  };

  this.displayBuyOrder = function() {
   $("#build-order").css("left", "0px");
  };
};
