var UIManager = new function() {
  var self = this;

  var elements = {
    shop: $("#naut-shop"),
    buildOrder: $("#build-order"),
    nautSplashArt: $("#naut-splash-art"),
    nautDescription: $("#naut-description"),
    skillDescription: $("#skill-description"),
    nautList: $("#naut-list"),
    about: $("#about")
  };

  var draggedReorderUpgrade = false;

  /**
   * Add events
   */
  this.init = function() {
    // Shop & div animation while entering / leaving #naut-list
    EventManager.addEvent(elements.nautList, "mouseenter", self.onMouseEnterNautList);
    EventManager.addEvent(elements.nautList, "mouseleave", self.onMouseLeaveNautList);
    EventManager.addEvent(window, "resize", self.alignShopIconVertically);
  };

  /**
   * Add an upgrade with automatic events (desc on hover, etc) to the selector
   * @param {string} selector - The target element
   * @param {object} upgrade - The upgrade to display
   * @param {boolean} purchasable - If the upgrade can be clicked to change its state.
   * @param {JqueryObject} - Returns the created container
   */
  this.addUpgradeToSelector = function(selector, upgrade, purchasable) {
    var stageCount = (upgrade.step1 ? 1 : 0) + (upgrade.step2 ? 1 : 0) + (upgrade.step3 ? 1 : 0) + (upgrade.step4 ? 1 : 0);
    var shopItemContainer = $("<div>");

    shopItemContainer.addClass("shop-item-container");

    shopItemContainer.append(
        $("<img>")
          .attr("src", upgrade.icon)
          .data("default-url", upgrade.icon)
          .addClass(purchasable ? "shop-item-upgrade" : "shop-item-upgrade purchased")
    );

    shopItemContainer
      .data("upgrade-step1", upgrade.step1)
      .data("upgrade-step2", upgrade.step2)
      .data("upgrade-step3", upgrade.step3)
      .data("upgrade-step4", upgrade.step4)
      .data("upgrade-cost", upgrade.cost)
      .data("upgrade-stage", 0)
      .data("upgrade-stage-max", stageCount)

    EventManager.addEvent(shopItemContainer, "mouseenter", function(){
      tooltip.display(
        "<b>" + $("<p>" + upgrade.name + "</p>").text() + "</b><br><br>" +
        "<img style='vertical-align: middle;' src='" + BASE_PATH + "images/solar-icon.png" + "'/>" + $("<p>" + upgrade.cost + "</p>").text() + "<br><br>" +
        (upgrade.step1 ? "Stage 1<br><span class='tooltip-upgrades'>- " + SkillParser.getUpgradeTextFormated($("<p>" + upgrade.step1 + "</p>").text()) + "</span><br><br>" : "") +
        (upgrade.step2 ? "Stage 2<br><span class='tooltip-upgrades'>- " + SkillParser.getUpgradeTextFormated($("<p>" + upgrade.step2 + "</p>").text()) + "</span><br><br>" : "") +
        (upgrade.step3 ? "Stage 3<br><span class='tooltip-upgrades'>- " + SkillParser.getUpgradeTextFormated($("<p>" + upgrade.step3 + "</p>").text()) + "</span><br><br>" : "") +
        (upgrade.step4 ? "Stage 4<br><span class='tooltip-upgrades'>- " + SkillParser.getUpgradeTextFormated($("<p>" + upgrade.step4 + "</p>").text()) + "</span><br><br>" : "") +
        "<span class='naut-story'>" + nl2br($("<p>" + upgrade.description + "</p>").text()).replace(/\*(.+)\*/i, '<i>$1</i>') + "</span>"
      );
    });

    EventManager.addEvent(selector, "mouseleave", function(){
      tooltip.remove();
    });

    if(purchasable) {
      // Upgrade cost
      shopItemContainer.append(
        $("<span>" + upgrade.cost + " </span>")
          .addClass("shop-item-price")
          .append(
            $("<img>")
            .addClass("shop-item-image")
            .attr("src", BASE_PATH + "images/solar-icon.png")
          )
      );

      // Upgrade stage
      shopItemContainer.append(
        $("<span>")
        .addClass("shop-item-stage")
        .append($("<span>0</span>").addClass("shop-item-stage-value"))
        .append($("<span> / " + stageCount + "</span>"))
      );

      EventManager.addEvent(shopItemContainer, "click", function(){
        if($(".shop-item-upgrade", this).hasClass("locked"))
          return;

        // Handle buy item
        var currentUpgradeStage = $(this).data("upgrade-stage");
        var nextUpgradeStage = currentUpgradeStage + 1;

        if(nextUpgradeStage > $(this).data("upgrade-stage-max")) {
          nextUpgradeStage = 0;
        }

        $(this).data("upgrade-stage", nextUpgradeStage);

        // Add purchased to the image
        if(nextUpgradeStage == 0 || nextUpgradeStage == 1) {
          $(".shop-item-upgrade", this).toggleClass("purchased");
        }

        if($(".shop-item-container .purchased", $(this).parent()).length == 3) {
          $(".shop-item-container", $(this).parent()).each(function(i){
            if($(this).data("upgrade-stage") == 0) {
              $(".shop-item-stage", this).hide();
              $(".shop-item-price", this).hide();
              $(".shop-item-upgrade", this).attr("src", BASE_PATH + "images/locked.png");
              $(".shop-item-upgrade", this).addClass("locked");
            }
          });
        }
        else {
          $(".shop-item-container", $(this).parent()).removeClass("locked");
          $(".shop-item-container .shop-item-stage", $(this).parent()).show();
          $(".shop-item-container .shop-item-price", $(this).parent()).show();
          $(".shop-item-container .shop-item-upgrade", $(this).parent()).removeClass("locked");

          $(".shop-item-container .shop-item-upgrade", $(this).parent()).each(function(i){
            $(this).attr("src", $(this).data("default-url"));
          });
        }

        // Set the text for the current stage
        $(".shop-item-stage-value", this).text(nextUpgradeStage);

        NautsBuilder.onItemUpgradeClicked(upgrade, nextUpgradeStage);
      });
    }

    $(selector).append(shopItemContainer);
    return shopItemContainer;
  };

  /**
   * Add a skill with automatic events (desc on hover, etc) to the selector
   * @param {string} selector - The target element
   * @param {object} skill - The skill to display
   */
  this.addSkillToSelector = function(selector, skill) {
    var shopSkillContainer = $("<div>");

    shopSkillContainer.addClass("shop-skill-container");
    shopSkillContainer.append(
      $("<img>")
        .attr("src", skill.icon)
        .addClass("shop-item-skill")
    );

    shopSkillContainer.data("skill-effects", skill.effects);

    EventManager.addEvent(shopSkillContainer, "mouseenter", function(){
      tooltip.display(
        "<b>" + $("<p>" + skill.name + "</p>").text() + "</b><br><br>" +
        "Effects<br><span class='tooltip-upgrades'>- " + SkillParser.getUpgradeTextFormated($("<p>" + skill.effects + "</p>").text()) + "</span><br><br>" +
        "<span class='naut-story'>" + nl2br($("<p>" + skill.description + "</p>").text()) + "</span>"
      );
    });

    EventManager.addEvent(shopSkillContainer, "mouseleave", function(){
      tooltip.remove();
    });

    $(selector).append(shopSkillContainer);
  };

  /**
   * Display the shop for the specified naut
   * @param {object} naut - Data for an Awesomenauts
   */
  this.displayShop = function(naut) {
    elements.shop.show();
    elements.buildOrder.show();

    for(var i = 0 ; i < naut.skills.length; ++i) {
      var skill = naut.skills[i];

      // Clear the row to remove existing item
      $("#shop-row-" + (i + 1)).html("");

      // Add skills icon to the shop
      self.addSkillToSelector("#shop-row-" + (i + 1), skill);

      // Add upgrades icon to the shop
      for(var j = 0; j < skill.upgrades.length; ++j) {
        // Used to create the buy order (since we want a retro-compatibility with nautsbuilder v1)
        (function(skill, i, j){
          skill.upgrades[j].index = i * 6 + j + i + 1;
        })(skill, i, j);

        this.addUpgradeToSelector("#shop-row-" + (i + 1), skill.upgrades[j], true);
      }
    }

    self.alignShopIconVertically();
  };

  /**
   * Display naut's art, skills and description. Remove it if naut is set to false (except if selectedNaut is set)
   * @param {object} naut - Data for an Awesomenauts or false
   */
  this.displayNautInformation = function(naut) {
    if(naut == false) {
      // Do not clear informations if a naut is selected
      elements.nautSplashArt.html("");
      elements.nautDescription.html("");
      elements.skillDescription.html("");
      return;
    }

    // Description
    elements.nautDescription
      .html("")
      .append($("<div>").text(naut.role + " - " + naut.attacktype + " - " + naut.mobility)
      .append($("<div>").addClass("naut-story").html(nl2br($("<p>"+naut.description+"</p>").text())))
    );

    // Art
    elements.nautSplashArt
      .html("")
      .append(
        $("<div>")
          .addClass("naut-name")
          .text(naut.name)
      )
      .append(
        $("<img>")
          .addClass("naut-image")
          .attr("src", naut.image)
      )

      // Skills
      elements.skillDescription.html("<div>Skills</div>");
      if(naut.skills) {
        for(var i = 0; i < naut.skills.length; ++i) {
          var skill = naut.skills[i];
          elements.skillDescription
            .append($("<img>").attr("src", skill.icon))
            .append($("<span>").text(skill.description))
            .append($("<hr>"))
        }
      }
  };

  /**
   * Because I hate css. Vertical align the icon in the shop
   */
  this.alignShopIconVertically = function() {
    $("#naut-shop .shop-item-upgrade, #naut-shop .shop-item-skill").css("margin-top", ($("#shop-row-1").height() / 2 - $("#shop-row-1").width() / 16) + "px");
  };

  /**
   * Add all the nauts in #nauts-list
   * @param {array} nauts - The list of nauts to add
   */
  this.addNautsToUi = function(nauts) {
    for(var i = 0; i < nauts.length; ++i) {
      var naut = nauts[i];

      (function(naut){
        var nautImage = $("<img>");
        nautImage
          .attr("src", naut.icon)
          .addClass("naut-icon")
          .attr("id", "naut-icon-" + getValidElementId(naut.name));


        // TODO: Check if it's required to add onmouseleave and to clear displayNautInfo
        EventManager.addEvent(nautImage, "mouseenter", function(){
          self.displayNautInformation(naut);
        });

        EventManager.addEvent(nautImage, "click", function(){
          // Remove all other selections and select this image
          $(".naut-icon").removeClass("selected");
          $(this).addClass("selected");

          elements.nautList.removeClass("naut-list-center");
          elements.nautList.addClass("naut-list-right");

          self.displayShop(naut);
          self.onMouseLeaveNautList();
          NautsBuilder.onNautSelected(naut);
        });

        elements.nautList.append(nautImage);
      })(naut);
    }

    // Add the random icon
    var randomIcon = $("<img>");
    randomIcon.attr("src", BASE_PATH + "images/random-naut.png").addClass("naut-icon");

    EventManager.addEvent(randomIcon, "click", function(){
      var randomNaut = Math.round(Math.random() * $("#naut-list .naut-icon").length);
      $("#naut-list .naut-icon").each(function(i, item) {
        if(i == randomNaut) {
          $(this).click();
          NautsBuilder.getRandomBuild();

          return false;
        }
      });

    });

    elements.nautList.append(randomIcon);
  };

  /**
   * Hide the shop and infobox when the mouse enters the naut list
   */
  this.onMouseEnterNautList = function() {
    var offsetLeft = "-55%";

    elements.shop.css("left", offsetLeft);
    elements.buildOrder.css("left", offsetLeft);

    elements.nautSplashArt.fadeIn();
    elements.nautDescription.fadeIn();
    elements.skillDescription.fadeIn();
    elements.about.fadeOut();

    $(".build-info").fadeOut();
  };

  /**
   * Display the shop and infobox when the mouse leaves the naut list
   */
  this.onMouseLeaveNautList = function() {
    if(!elements.shop.is(":visible")) {
      return;
    }

    elements.shop.css("left", 0 + "px");
    elements.buildOrder.css("left", 0 + "px");

    elements.nautSplashArt.fadeOut();
    elements.nautDescription.fadeOut();
    elements.skillDescription.fadeOut();
    elements.about.fadeIn();

    $(".build-info").fadeIn();
  };

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
    if(!self.draggedReorderUpgrade) {
      $("#build-order-content .shop-item-container").removeClass("selected");
      $(this).addClass("selected");

      self.draggedReorderUpgrade = this;
    }
    else {
      NautsBuilder.swapBuildOrder($(self.draggedReorderUpgrade).data("index"), $(this).data("index"));
    }
  };

  /**
   * Display the right upgrades in the buyOrder box
   */
  this.updateBuyOrder = function(buyOrder) {
    $("#build-order-content").html("");
    for(var i = 0; i < buyOrder.length; ++i) {
      var upgradeContainer = this.addUpgradeToSelector("#build-order-content", buyOrder[i], false);
      upgradeContainer.data("index", i);
      EventManager.addEvent(upgradeContainer, "click", self.handleReorderClick);

      $("#build-order-content").append(" > ");
    }
  }
};
