var ShopView = new function() {
  var self = this;

  // TODO: Desc
  this.init = function() {
    this.hideShop();
    this.hideBuyOrder();

    $("#build-order").show();
    $("#naut-shop").show();
    $(window).on("resize", self.onWindowResize);
  };

  // TODO: Desc
  this.setDisplayStage = function(row, col, stage, stageCount) {
    var row = $("#shop-row-" + (row + 1));
    $(".shop-item-upgrade", row).each(function(i){
      if(i == col) {
        if(stage > 0) {
          if(!$(this).hasClass("purchased")) {
            $(this).addClass("purchased");
          }
        }
        else {
          $(this).removeClass("purchased");
        }
        // Display stage
        $(".shop-item-stage", this.parentElement).text(stage + " / " + stageCount);
      }
    });

    this.updateBuildOrderDisplay();
    lockUpgradesWhenRowFull();
  };

  // TODO: Desc
  var lockUpgradesWhenRowFull = function() {
    for(var i = 0; i < 4; ++i) {
      var row = $("#shop-row-" + (i + 1));

      // TODO: Don't hardcode the max numbre of upgrade per row
      if(Build.current.getRowUpgradeCount(i) >= 3) {
        $(".shop-item-upgrade", row).each(function(){
          if(!$(this).hasClass("purchased")) {

            // Item isn't purchased and already 3 item have been bought => we change the icon
            $(this).attr("src", CONFIG.path.images + "locked.png");
            $(this).addClass("locked");

            if(self.isBigScreen()) {
              $(this).addClass("locked-big");
            }

            // Hide stage and upgrade cost
            $("span", this.parentElement).hide();
          }
        });
      }
      else {
        // Unlock and enable all upgrades
        $(".locked", row).each(function(){
          $(".shop-item-upgrade", this).data("disabled", false);
          $(this).removeClass("locked");
          $(this).removeClass("locked-big");
          // Restore default image
          $(this).attr("src", $(this).data("default-url"));
          $("span", this.parentElement).show();
        });
      }
    }
  };

  // TODO: Desc
  this.displaySkillsAndUpgrades = function(naut) {
    var skills = naut.getSkills();

    for(var i = 0; i < skills.length; ++i) {
      var skill = skills[i];
      // We empty the row so we don't have to reset anything when selecting another char
      $("#shop-row-" + (i + 1)).html("");

      // Skill icon
      var skillImageElement = $("<img>")
        .attr("src", skills[i].getIcon())
        .addClass("shop-item-skill");

      // Skill container
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

        (function(i, j, upgrade){
          // Upgrade image
          var upgradeImageElement = $("<img>")
            .attr("src", upgrade.getIcon())
            .data("default-url", upgrade.getIcon())
            .on('dragstart', function(e) { e.preventDefault(); })
            .addClass("shop-item-upgrade");

          // Upgrade container
          $("<div>")
            .addClass("shop-item-container")
            .append(upgradeImageElement)
            .append($("<span>").text("0 / " + upgrade.getStageCount()).addClass("shop-item-stage"))
            .append($("<span>")
              .addClass("shop-item-price")
              .text(upgrade.getCost())
              .append(
                // Solar icon
                $("<img>")
                .addClass("shop-item-image")
                .on('dragstart', function(e) { e.preventDefault(); })
                .attr("src", CONFIG.path.images + "/" + "solar-icon.png")
              )
            )
            .on("click", function(){
              // Can we select this upgrade?
              if(Build.current.getRowUpgradeCount(i) >= 3 && Build.current.getUpgradeStage(i, j) == 0) {
                return;
              }

              // Tell the controller we selected an upgrade
              var stage = BuildController.onUpgradeClick(i, j);
              // Display new stage
              self.setDisplayStage(i, j, stage, upgrade.getStageCount());
            })
            .appendTo("#shop-row-" + (i + 1));

            Tooltip.createDefault(upgradeImageElement, upgrade.toString());
        })(i, j, upgrades[j]);
      }
    }

    this.onWindowResize();
  };

  // TODO: Desc
  this.onWindowResize = function() {
    // If the screen is big enough, we display upgrade cost below the upgrade
    if(self.isBigScreen()) {
      $(".shop-item-price").attr("class", "shop-item-price-big");
      $(".locked").addClass("locked-big");
    }
    else {
      $(".shop-item-price-big").attr("class", "shop-item-price");
      $(".locked").removeClass("locked-big");
    }
    self.alignShopIconVertically();
  };

  // TODO: Desc
  this.isBigScreen = function() {
    return ($("#shop-row-1").innerHeight() > 140);
  };

  // TODO: Desc
  this.hideShop = function() {
    $("#naut-shop").css("left", (-$("#naut-shop").outerWidth() - 200) + "px");
  };

  // TODO: Desc
  this.hideBuyOrder = function() {
    $("#build-order").css("left", (-$("#build-order").outerWidth() - 200) + "px");
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
  this.showBuildOrderPanel = function(enabled) {
    if(enabled) {
      $("#buy-order-status").text("Disable");
      $("#build-order").removeClass("panel-disabled");
      $("#buy-order-text").fadeIn();
      $("#build-order-content").fadeIn();
    }
    else {
      $("#buy-order-status").text("Enable buy order");
      $("#build-order").addClass("panel-disabled");
      $("#buy-order-text").fadeOut();
      $("#build-order-content").fadeOut();
    }
  };

  // TODO: Desc
  this.setSelectedUpgradePosition = function(x, y){
    var upgradeAttachedToMouse = $("#moving-upgrade");

    if(upgradeAttachedToMouse.length > 0) {
      upgradeAttachedToMouse.css("left", x  - upgradeAttachedToMouse.width() / 2 + "px");
      upgradeAttachedToMouse.css("top", y - upgradeAttachedToMouse.height() / 2 + "px");
    }
  };

  // TODO: Desc
  this.displayBuildOrderTempUpgrade = function(upgrade, element) {
    $(element).remove(); // Remove the element we're going to move
    $("#moving-upgrade").remove(); // Remove any current selected upgrade

    $("body").append(
      $("<img>")
        .attr("src", upgrade.getIcon())
        .attr("id", "moving-upgrade")
        .on('dragstart', function(e) { e.preventDefault(); })
        .on("mouseup", function(){
          BuildController.onBuildOrderUpgradeMouseUp();
        })
    );
  };

  // TODO: Desc
  this.updateBuildOrderDisplay = function(tempUpgradeIndex) {
    $("#build-order-content").html(""); // Clear current order
    var buildOrder = Build.current.getBuildOrder();

    if(tempUpgradeIndex !== undefined) {
      buildOrder = buildOrder.slice(); // We create a copy so we can change it without problem
      buildOrder.splice(tempUpgradeIndex, 0, -1);
    }

    for(var i = 0; i < buildOrder.length; ++i) {
      if(buildOrder[i] != -1) {
        var upgrade = Build.current.getUpgradeFromIndex(buildOrder[i]);

        (function(upgrade, i){
          // Build order upgrade
          var img = $("<img>");
          var tooltip;
          if(tempUpgradeIndex === undefined) {
            tooltip = Tooltip.createDefault(img, upgrade.toString());
          }

          img
            .attr("src", upgrade.getIcon())
            .addClass("shop-item-upgrade purchased")
            .on("mousedown", function(){
                if(tempUpgradeIndex === undefined) {
                  tooltip.hide();
                }
                BuildController.onBuyOrderUpgradeMouseDown(upgrade, this, buildOrder[i], i);
            });


          // Add it to the buy order
          $("#build-order-content").append($("<div>").addClass("shop-item-container").append(img));

          // Only add a ">" if it's not the last upgrade
          if(i + 1 < buildOrder.length) {
            $("#build-order-content").append(" > ");
          }
        })(upgrade, i);
      }
      else {
        $("#build-order-content").append(
          $("<div>")
            .addClass("shop-item-container")
            .addClass("build-order-empty")
            .append(
              $("<img>")
              .attr("src", CONFIG.path.images + "empty-upgrade.png")
              .addClass("shop-item-upgrade purchased")
            ));
          // Only add a ">" if it's not the last upgrade
          if(i + 1 < buildOrder.length) {
            $("#build-order-content").append(" > ");
          }
      }
    }
  };

  // TODO: Desc
  this.onBuildOrderUpgradeDragEnd = function() {
    $("#moving-upgrade").remove();
  };

  /**
   * TODO: Desc
   * Because I hate css. Vertical align the icon in the shop
   */
  this.alignShopIconVertically = function() {
    $("#naut-shop .shop-item-upgrade, #naut-shop .shop-item-skill").css("margin-top", ($("#shop-row-1").height() / 2 - $("#shop-row-1").width() / 16) + "px");
  };
};
