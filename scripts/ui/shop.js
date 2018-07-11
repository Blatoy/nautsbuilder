let UIShop = new function() {
  let draggedReorderUpgrade = false;
  let self = this;

  /**
   * Display the right upgrades in the buyOrder box
   */
  this.updateBuyOrder = function(buyOrder) {
    $("#build-order-content").html("");
    for (let i = 0; i < buyOrder.length; ++i) {
      let upgradeContainer = UIUpgrade.addUpgradeToSelector("#build-order-content", buyOrder[i], false);
      upgradeContainer.data("index", i);
      EventManager.addEvent(upgradeContainer, "click", self.handleReorderClick);

      $("#build-order-content").append(" > ");
    }
  }

  /**
   * Remove all the upgrades in the buyOrder box
   */
  this.clearBuyOrder = function() {
    $("#build-order-content").html("");
  };

  /**
   * Handle build reorder
   */
  this.handleReorderClick = function() {
    if (!self.draggedReorderUpgrade) {
      $("#build-order-content .shop-item-container").removeClass("selected");
      $(this).addClass("selected");

      self.draggedReorderUpgrade = this;
    } else {
      NautsBuilder.swapBuildOrder($(self.draggedReorderUpgrade).data("index"), $(this).data("index"));
    }
  };

  /**
   * Because I hate css. Vertical align the icon in the shop
   */
  this.alignShopIconVertically = function() {
    $("#naut-shop .shop-item-upgrade, #naut-shop .shop-item-skill").css("margin-top", ($("#shop-row-1").height() / 2 - $("#shop-row-1").width() / 16) + "px");
  };

  /**
   * Display the shop for the specified naut
   * @param {object} naut - Data for an Awesomenauts
   */
  this.displayShop = function(naut) {
    UIManager.elements.shop.show();
    UIManager.elements.buildOrder.show();

    for (let i = 0; i < naut.skills.length; ++i) {
      let skill = naut.skills[i];

      // Clear the row to remove existing item
      $("#shop-row-" + (i + 1)).html("");

      // Add skills icon to the shop
      UIUpgrade.addSkillToSelector("#shop-row-" + (i + 1), skill);

      // Add upgrades icon to the shop
      for (let j = 0; j < skill.upgrades.length; ++j) {
        // Used to create the buy order (since we want a retro-compatibility with nautsbuilder v1)
        (function(skill, i, j) {
          skill.upgrades[j].index = i * 6 + j + i + 1;
        })(skill, i, j);

        UIUpgrade.addUpgradeToSelector("#shop-row-" + (i + 1), skill.upgrades[j], true);
      }
    }

    self.alignShopIconVertically();
  };
};
