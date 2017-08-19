
/**
 * var BuildController - Controls everything related to the build (e.g: upgrades in the shop)
 */
var BuildController = new function(){
  this.init = function(){
    Build.current = new Build();
  };

  // TODO: Desc
  this.onNautSelected = function(naut) {
    Build.current.setNaut(naut);
  //  Build.current.debugPrintBuild();
    ShopView.displayShop();
    ShopView.displayBuyOrder();
  };

  // TODO: Desc
  this.onUpgradeClick = function(e){
    // Build.setUpgradeStage(row, col, stage)
    // Build.updateeeee
  };

  // TODO: Desc
  this.onUpgradeHover = function(e){
    // TooltipView.display(Build.getUpgradeAt(row, col).getDesc())
  };

  // TODO: Desc
  this.onSkillHover = function(e){
    // TooltipView.display(Build.getSkill(row).getDesc())
  };

  // TODO: Desc
  this.onBuyOrderUpgradeMouseDown = function(e){
    // Build.selectUpgradeToReorder(index)
  };
  this.onBuyOrderUpgradeMouseMove = function(e){
    // Build.(index)
  };
  this.onBuyOrderUpgradeMouseUp = function(e){};
  this.importBuildFromURLData = function(data){};
};
