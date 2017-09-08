
/**
 * var BuildController - Controls everything related to the build (e.g: upgrades in the shop)
 */
var BuildController = new function(){
  var buildOrderSelectedUpgradeId = -1, buildOrderSelectedUpgradeNewIndex = -1;
  var mousePos = {x: 0, y: 0};
  var self = this;

  // TODO: Desc
  this.init = function(){
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
  this.onBuyOrderUpgradeMouseDown = function(upgrade, element, upgradeId, index){
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
    var movedUpgrade = $("#moving-upgrade");
    if(movedUpgrade.length > 0) {
      var x = mousePos.x;
      var y = mousePos.y;
      // Fix that the first time it doesn't display the placeholder upgrade
      if(index !== undefined) {
        buildOrderSelectedUpgradeNewIndex = index;
        ShopView.updateBuildOrderDisplay(index, buildOrderSelectedUpgradeId);
      }
      else {
        $("#build-order-content .shop-item-container").each(function(i){
          var x1 = this.getBoundingClientRect().left;
          var y1 = this.getBoundingClientRect().top;
          var w = $(this).width();
          var h = $(this).height();

          // Check height
          if(y > y1 && y < y1 + h && x > x1 && x < x1 + w) {
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
  };

  // TODO: Desc
  this.onNautSelected = function(naut) {
    Build.current.setNaut(naut);
  //  Build.current.debugPrintBuild();
    ShopView.displaySkillsAndUpgrades(naut);
    ShopView.updateBuildOrderDisplay();
    ShopView.displayShop();
    ShopView.displayBuyOrder();
    InfoBoxView.setBuildSummaryContent();
  };

  // TODO: Desc
  this.onUpgradeClick = function(row, col){
    var stage = Build.current.setUpgradeStage(row, col);
    InfoBoxView.setBuildSummaryContent();
    return stage;
  };

  this.importBuildFromURLData = function(data){};
};
