/**
 * let BuildController - Controls everything related to the build (e.g: upgrades in the shop)
 */
let BuildController = new function() {
  let buildOrderSelectedUpgradeId = -1,
    buildOrderSelectedUpgradeNewIndex = -1;
  let mousePos = {
    x: 0,
    y: 0
  };
  let self = this;

  // TODO: Desc
  this.init = function() {
    Build.current = new Build();

    $(window).on("mousemove", self.onMouseMove);
  };

  // TODO: Desc
  this.onMouseMove = function(e) {
    mousePos.x = e.pageX;
    mousePos.y = e.pageY;

    ShopView.setSelectedUpgradePosition(mousePos.x, mousePos.y);
    self.handleBuildOrderReorder();
  };

  // TODO: Desc
  this.onBuyOrderUpgradeMouseDown = function(upgrade, element, upgradeId, index) {
    buildOrderSelectedUpgradeId = upgradeId;
    // Add the temp element that follows the mouse
    ShopView.displayBuildOrderTempUpgrade(upgrade, element);
    // Move it to the mouse pos
    ShopView.setSelectedUpgradePosition(mousePos.x, mousePos.y);
    // Remove the item from the build order and refresh display
    Build.current.removeItemFromBuildOrder(index);
    self.handleBuildOrderReorder(index);
  };

  // TODO: Desc
  this.handleBuildOrderReorder = function(index) {
    let movedUpgrade = $("#moving-upgrade");
    if (movedUpgrade.length > 0) {
      let x = mousePos.x;
      let y = mousePos.y;
      // Fix that the first time it doesn't display the placeholder upgrade
      if (index !== undefined) {
        buildOrderSelectedUpgradeNewIndex = index;
        ShopView.updateBuildOrderDisplay(index, buildOrderSelectedUpgradeId);
      } else {
        $("#build-order-content .shop-item-container").each(function(i) {
          let x1 = this.getBoundingClientRect().left;
          let y1 = this.getBoundingClientRect().top;
          let w = $(this).width();
          let h = $(this).height();

          // Check height
          if (y > y1 && y < y1 + h && x > x1 && x < x1 + w) {
            buildOrderSelectedUpgradeNewIndex = i;
            ShopView.updateBuildOrderDisplay(Math.max(i, 0), buildOrderSelectedUpgradeId);
            return;
          }
        });
      }
    }
  };

  // TODO: Desc
  this.onBuildOrderUpgradeMouseUp = function() {
    Build.current.addUpgradeToBuildOrderAtIndex(buildOrderSelectedUpgradeId, buildOrderSelectedUpgradeNewIndex);
    ShopView.onBuildOrderUpgradeDragEnd();
    ShopView.updateBuildOrderDisplay();
    this.refreshViewsAndURL();
  };

  // TODO: Desc
  this.onNautSelected = function(naut) {
    Build.current.setNaut(naut);
    this.setAllViews();
  };

  // TODO: Desc
  this.setRandomBuild = function() {
    Build.current.setRandomBuild();
    this.setAllViews();
    ShopView.updateAllUpgradeStage();
  };

  // TODO: Desc
  this.setAllViews = function() {
    ShopView.displaySkillsAndUpgrades(Build.current.getNaut());
    ShopView.displayShop();
    ShopView.displayBuyOrder();
    this.refreshViewsAndURL();
  };

  // TODO: Desc
  this.onUpgradeClick = function(row, col) {
    let stage = Build.current.setUpgradeStage(row, col);
    this.refreshViewsAndURL();
    return stage;
  };

  // TODO: Desc
  this.setUrlData = function() {
    setHash(Build.current.toString());
  };

  this.refreshViewsAndURL = function() {
    ShopView.updateBuildOrderDisplay();
    InfoBoxView.setBuildSummaryContent();
    this.setUrlData();
  };

  this.importBuildFromURLData = function(data) {};
};
