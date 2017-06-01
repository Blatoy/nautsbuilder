var UIManager = new function() {
  var self = this;
  this.elements = {};

  /**
   * Add events and ge
   */
  this.init = function() {
    this.elements = {
      shop: $("#naut-shop"),
      buildOrder: $("#build-order"),
      nautSplashArt: $("#naut-splash-art"),
      nautDescription: $("#naut-description"),
      skillDescription: $("#skill-description"),
      nautList: $("#naut-list"),
      about: $("#about")
    };

    // Shop & div animation while entering / leaving #naut-list
    EventManager.addEvent(this.elements.nautList, "mouseenter", UINautList.onMouseEnterNautList);
    EventManager.addEvent(this.elements.nautList, "mouseleave", UINautList.onMouseLeaveNautList);
    EventManager.addEvent(window, "resize", UIShop.alignShopIconVertically);
  };
};
