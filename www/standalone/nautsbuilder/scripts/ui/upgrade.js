let UIUpgrade = new function() {
  let self = this;

  /**
   * Add an upgrade with automatic events (desc on hover, etc) to the selector
   * @param {string} selector - The target element
   * @param {object} upgrade - The upgrade to display
   * @param {boolean} purchasable - If the upgrade can be clicked to change its state.
   * @param {JqueryObject} - Returns the created container
   */
  this.addUpgradeToSelector = function(selector, upgrade, purchasable) {
    let stageCount = (upgrade.step1 ? 1 : 0) + (upgrade.step2 ? 1 : 0) + (upgrade.step3 ? 1 : 0) + (upgrade.step4 ? 1 : 0);
    let shopItemContainer = $("<div>");

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

    EventManager.addEvent(shopItemContainer, "mouseenter", function() {
      tooltip.display(
        "<b>" + $("<p>" + upgrade.name + "</p>").text() + "</b><br><br>" +
        "<img style='vertical-align: middle;' src='" + CONFIG.path.images + "/solar-icon.png" + "'/>" + $("<p>" + upgrade.cost + "</p>").text() + "<br><br>" +
        (upgrade.step1 ? "Stage 1<br><span class='tooltip-upgrades'>- " + SkillParser.getUpgradeTextFormated($("<p>" + upgrade.step1 + "</p>").text()) + "</span><br><br>" : "") +
        (upgrade.step2 ? "Stage 2<br><span class='tooltip-upgrades'>- " + SkillParser.getUpgradeTextFormated($("<p>" + upgrade.step2 + "</p>").text()) + "</span><br><br>" : "") +
        (upgrade.step3 ? "Stage 3<br><span class='tooltip-upgrades'>- " + SkillParser.getUpgradeTextFormated($("<p>" + upgrade.step3 + "</p>").text()) + "</span><br><br>" : "") +
        (upgrade.step4 ? "Stage 4<br><span class='tooltip-upgrades'>- " + SkillParser.getUpgradeTextFormated($("<p>" + upgrade.step4 + "</p>").text()) + "</span><br><br>" : "") +
        "<span class='naut-story'>" + nl2br($("<p>" + upgrade.description + "</p>").text()).replace(/\*(.+)\*/i, '<i>$1</i>') + "</span>"
      );
    });

    EventManager.addEvent(selector, "mouseleave", function() {
      tooltip.remove();
    });

    if (purchasable) {
      // Upgrade cost
      shopItemContainer.append(
        $("<span>" + upgrade.cost + " </span>")
        .addClass("shop-item-price")
        .append(
          $("<img>")
          .addClass("shop-item-image")
          .attr("src", CONFIG.path.images + "/solar-icon.png")
        )
      );

      // Upgrade stage
      shopItemContainer.append(
        $("<span>")
        .addClass("shop-item-stage")
        .append($("<span>0</span>").addClass("shop-item-stage-value"))
        .append($("<span> / " + stageCount + "</span>"))
      );

      EventManager.addEvent(shopItemContainer, "click", function() {
        if ($(".shop-item-upgrade", this).hasClass("locked"))
          return;

        // Handle buy item
        let currentUpgradeStage = $(this).data("upgrade-stage");
        let nextUpgradeStage = currentUpgradeStage + 1;

        if (nextUpgradeStage > $(this).data("upgrade-stage-max")) {
          nextUpgradeStage = 0;
        }

        $(this).data("upgrade-stage", nextUpgradeStage);

        // Add purchased to the image
        if (nextUpgradeStage == 0 || nextUpgradeStage == 1) {
          $(".shop-item-upgrade", this).toggleClass("purchased");
        }

        if ($(".shop-item-container .purchased", $(this).parent()).length == 3) {
          $(".shop-item-container", $(this).parent()).each(function(i) {
            if ($(this).data("upgrade-stage") == 0) {
              $(".shop-item-stage", this).hide();
              $(".shop-item-price", this).hide();
              $(".shop-item-upgrade", this).attr("src", CONFIG.path.images + "/locked.png");
              $(".shop-item-upgrade", this).addClass("locked");
            }
          });
        } else {
          $(".shop-item-container", $(this).parent()).removeClass("locked");
          $(".shop-item-container .shop-item-stage", $(this).parent()).show();
          $(".shop-item-container .shop-item-price", $(this).parent()).show();
          $(".shop-item-container .shop-item-upgrade", $(this).parent()).removeClass("locked");

          $(".shop-item-container .shop-item-upgrade", $(this).parent()).each(function(i) {
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
    let shopSkillContainer = $("<div>");

    shopSkillContainer.addClass("shop-skill-container");
    shopSkillContainer.append(
      $("<img>")
      .attr("src", skill.icon)
      .addClass("shop-item-skill")
    );

    shopSkillContainer.data("skill-effects", skill.effects);

    EventManager.addEvent(shopSkillContainer, "mouseenter", function() {
      tooltip.display(
        "<b>" + $("<p>" + skill.name + "</p>").text() + "</b><br><br>" +
        "Effects<br><span class='tooltip-upgrades'>- " + SkillParser.getUpgradeTextFormated($("<p>" + skill.effects + "</p>").text()) + "</span><br><br>" +
        "<span class='naut-story'>" + nl2br($("<p>" + skill.description + "</p>").text()) + "</span>"
      );
    });

    EventManager.addEvent(shopSkillContainer, "mouseleave", function() {
      tooltip.remove();
    });

    $(selector).append(shopSkillContainer);
  };
};
