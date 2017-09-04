var ShopView = new function() {
  var self = this;

  this.init = function() {
    this.hideShop();
    this.hideBuyOrder();
    $("#build-order").show();
    $("#naut-shop").show();
    $(window).on("resize", self.onWindowResize);
  };

  // TODO: Desc
  this.setSkillsAndUpgrades = function(naut) {
    var skills = naut.getSkills();
    for(var i = 0; i < skills.length; ++i) {
      var skill = skills[i];
      $("#shop-row-" + (i + 1)).html("");

      var skillImageElement = $("<img>")
        .attr("src", skills[i].getIcon())
        .addClass("shop-item-skill");
      $("<div>")
        .addClass("shop-skill-container")
        .append(skillImageElement)
        .append($("<span>")
          .addClass("shop-item-price")
          .html("<br><br>")
        )
        .appendTo("#shop-row-" + (i + 1));

      Tooltip.createDefault(skillImageElement, skill.toString());

      var upgrades = skill.getUpgrades();
      for(var j = 0; j < upgrades.length; ++j) {
        var upgrade = upgrades[j];

        var upgradeImageElement = $("<img>")
          .attr("src", upgrade.getIcon())
          .addClass("shop-item-upgrade");
        $("<div>")
          .addClass("shop-item-container")
          .append(upgradeImageElement)
          .append($("<span>").text("0 / " + upgrade.getStageCount()).addClass("shop-item-stage"))
          .append($("<span>")
            .addClass("shop-item-price")
            .text(upgrade.getCost())
            .append($("<img>").addClass("shop-item-image").attr("src", CONFIG.path.images + "/" + "solar-icon.png"))
          )
          .appendTo("#shop-row-" + (i + 1));
        Tooltip.createDefault(upgradeImageElement, upgrade.toString());
      }
    }

    this.onWindowResize();
  };

  // TODO: Desc
  this.onWindowResize = function() {
    if($("#shop-row-1").innerHeight() > 140) {
      $(".shop-item-price").attr("class", "shop-item-price-big");
    }
    else {
      $(".shop-item-price-big").attr("class", "shop-item-price");
    }
    self.alignShopIconVertically();
  };

  // TODO: Desc
  this.hideShop = function() {
    $("#naut-shop").css("left", (-$("#naut-shop").outerWidth() - 100) + "px");
  };

  // TODO: Desc
  this.hideBuyOrder = function() {
    $("#build-order").css("left", (-$("#build-order").outerWidth() - 100) + "px");
  };

  // TODO: Desc
  this.displayShop = function() {
   $("#naut-shop").css("left", "0px");
  };

  // TODO: Desc
  this.displayBuyOrder = function() {
   $("#build-order").css("left", "0px");
  };

  // TODO: Desc
  this.setBuyOrderStatus = function(enabled) {
    if(enabled) {
      $("#buy-order-status").text("Disable");
      $("#build-order").removeClass("panel-disabled")
      $("#buy-order-text").fadeIn();
    }
    else {
      $("#buy-order-status").text("Enable buy order");
      $("#build-order").addClass("panel-disabled");
      $("#buy-order-text").fadeOut();
    }
  };

  /**
   * TODO: Desc
   * Because I hate css. Vertical align the icon in the shop
   */
  this.alignShopIconVertically = function() {
    $("#naut-shop .shop-item-upgrade, #naut-shop .shop-item-skill").css("margin-top", ($("#shop-row-1").height() / 2 - $("#shop-row-1").width() / 16) + "px");
  };
};
