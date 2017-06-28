/**
* var Build - Store informations about the current build
*
* @param  {string} URLData Something like: "Nibbs/1001000100200010010001000000/3" This is actually the same format as the old nautsbuilder
*/
var Build = function(URLData) {
  /**
  * @var purchasedUpgrades - Stores a 2D array of the current stage of an upgrade ([row][col])
  * @var buildOrder - Stores a list of upgrade index (to support old nautsbuilder format)
  * @var naut - The naut of this build
  */
  var buildOrder = [], purchasedUpgrades = [[], [], [], []], naut = {};
  var self = this;

  /**
  * var init - "Constructor" for this "class"
  *
  * @param  {string} URLData See class description
  */
  var init = function(URLData){
    purchasedUpgrades = [[0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]];
    if(URLData) {
      var build = self.getFromURL(URLData);
      buildOrder = build.order;
      purchasedUpgrades = build.purchasedUpgrades;
      naut = Naut.getByName(build.nautName);
    }
  };

  /**
  * this.getFromURL - Parse data from a URL. Used to import a build.
  *
  * @param  {string} URLData See class description
  * @returns  {object} {order: [], purchasedUpgrades: [[], [], [], []], nautName: "Nibbs"}
  */
  this.getFromURL = function(URLData){
    // "nautName/build/build-order"
    // Nibbs/1000000100000010010001000000/17-15-12-11
    var name = "", build = [], order = false;

    // [0] = nautName [1] = build [2] = build-order
    var data = URLData.split("/");

    name = data[0];
    if(data[1]) {
      // We convert the string to a 2 dimensional array
      for(var i = 0; i < data[1].length; ++i) {
        // The old nautsbuilder stores the stage for the skill but unlocking skills has been removed from the game
        if(i % 7 === 0) {
          continue;
        }

        var row = Math.floor(i / 7);
        build[row].push(data[1][i]);
      }
    }

    // Build order
    if(data[2]) {
      order = data[2].split("-");
    }

    return {nautName: name, purchasedUpgrades: build, order: order};
  };

  /**
  * this.setUpgradeStage - Set the stage of an upgrade
  *
  * @param  {number} row The row where the upgrade is located
  * @param  {number} col The row where the upgrade is located
  * @param  {number} stage Optional. If not specified it will increment the stage by 1 and reset it if > maxStage
  */
  this.setUpgradeStage = function(row, col, stage){
    if(stage !== undefined) {
      // Note: we actually don't check for the maximum stage
      purchasedUpgrades[row][col] = stage;
    }
    else {
      var maxUpgradeStage = naut.getSkills()[row].getUpgrades()[col].getStageCount();
      purchasedUpgrades[row][col] = purchasedUpgrades[row][col] + 1 > maxUpgradeStage ? 0 : purchasedUpgrades[row][col] + 1;
    }
  };

  /**
  * this.getRowPrice - Get the price of the selected upgrades in a row
  *
  * @param  {number} row The row to get the price. (between 0 - 3)
  */
  this.getRowPrice = function(row){
    var price = 0;
    var upgrades = naut.getSkills()[0].getUpgrades();

    for(var i = 0; i < upgrades.length; ++i) {
      // Upgrade cost * stage. No cost if stage = 0
      price += upgrades[i].getCost() * purchasedUpgrades[row][i];
    }

    return price;
  };

  /**
  * this.getRowEffects - Get the effects for the upgrades of a skill (skill effects included)
  *
  * @param  {number} row The row to get a list of effects (between 0 - 3)
  */
  this.getRowEffects = function(row){
    var effectList = {};
    var skillEffects = naut.getSkills()[row].getEffects();

    // Skill effects
    for(var i = 0; i < skillEffects.length; ++i) {
      this.addEffectToEffectList(skillEffects[i], effectList);
    }

    var upgrades = naut.getSkills()[row].getUpgrades();
    for(var i = 0; i < upgrades.length; ++i) {
      var upgradeEffects = upgrades[i].getSteps();
      for(var j = 0; j < upgradeEffects.length; ++j) {
        if(purchasedUpgrades[row][i] > 0) {
          this.addEffectToEffectList(upgradeEffects[j][purchasedUpgrades[row][i] - 1], effectList);
        }
      }
    }

    return effectList;
    // Naut.list[0].getSkills()[0].getUpgrades()[1].getSteps()
  };

  /**
  * this.addEffectToEffectList - Add the specified effect to the effect list
  * If the effect is already in the effectList we add the values and the coefficient
  * Also store the correct unit (%, s or none)
  *
  * @param  {object} effect The effect to add
  * @param  {object} effectList The effect list where the effect will be added
  */
  this.addEffectToEffectList = function(effect, effectList){
    var key = effect.getKey();
    var unit = effect.getUnit();
    var type = effect.getType();

    // Value and coeffs can be array if it's a numberArray value like 10% > 25% > 40%
    var value = 0, coefficient = 0;

    if(unit != "%") {
      // Number or string
      value = effect.getValue();
    }
    else {
      // Convert 95% to 0.95
      if(Array.isArray(effect.getValue())) {
        // TODO: Use a for loop instead of map
        coefficient = effect.getValue().map(function(e){
          return e / 100;
        });
      }
      else {
        coefficient = effect.getValue() / 100;
      }
    }

    // This is the easy part, the effect doesn't exist so we can just create it
    if(effectList[key] === undefined) {
      effectList[key] = {unit: unit, value: value, coefficient: coefficient, type: type};
    }
    else {
      var effectListItem = effectList[key];
      // Unit can be "%" only if "%" is the only unit
      if(effectListItem.unit == "%" && effect.getUnit() != "%") {
        effectListItem.unit = effect.getUnit();
      }

      if(effect.getUnit() == "%") {
        handleEffectMerge(value, effectListItem, "coefficient");
      }
      else {
        handleEffectMerge(value, effectListItem, "value");
      }
    }
  };

  this.debugPrintBuild = function() {
    /*
    Test code to test things
    var b = new Build(); b.setNaut(Naut.list[23]); var c = b.getRowEffects(2);

    for(var k in c) {
    	console.log(k + ": (" + c[k].value + " / " + c[k].coefficient + ") (" + c[k].unit + ")");
    }
    */
    console.log(naut.getName());
    console.log("      Skills              Shop        Cost");
    for(var i = 0; i < purchasedUpgrades.length; ++i) {
      var txt = "[" + naut.getSkills()[i].getName().padEnd(18, " ") + "] | ";
      for(var j = 0; j < purchasedUpgrades[i].length; ++j) {
        txt += purchasedUpgrades[i][j] + " ";
      }
      var e = this.getRowEffects(i);
      var txt2 = "";
      for(var k in e) {
        txt2 += k + ": " + e[k].value + " " + e[k].unit + " | ";
      }
      console.log(txt + " | " + this.getRowPrice(i) + "      | "+ txt2);
    }
  };


  /**
   * var handleEffectMerge - Perform a lot of check to se how to add values when adding effects
   *
   * @param  {number} value          effect.getValue() (/ 100 if getUnit() == "%")
   * @param  {type} effectListItem   The item having the same key
   * @param  {type} type             "coefficient" if value is a "%" or "value" if value is a "value" (or string)
   */
  var handleEffectMerge = function(value, effectListItem, type) {
    if(Array.isArray(value)) {
      if(Array.isArray(effectListItem[type])) {
        // Both are array
        for(var i = 0; i < value.length; ++i) {
          if(effectListItem[type][i]) {
            effectListItem[type][i] += value[i];
          }
          else {
            effectListItem.push(value[i]);
          }
        }
      }
      else {
        // Value is array but effectListItem is not
        for (var i = 0 ; i < value.length; ++i) {
          value[i] += effectListItem[type];
        }
        effectListItem[type] = value;
      }
    }
    else {
      if(Array.isArray(effectListItem[type])) {
        // Value is not an array but effectListem is
        for(var i = 0; i < effectListItem[type].length; ++i) {
          effectListItem[type][i] += value;
        }
      }
      else {
        // both are only numbers
        effectListItem[type] += value;
      }
    }
  };

  this.setNaut = function(character){
      naut = character;
  };

  this.generateRandom = function(){};
  this.setBuildOrderIndex = function(initialIndex, finalIndex){};

  /**
  * this.toString - Generate something like "Nibbs/1001000100200010010001000000/3" format: "nautname/purchasedUpgrades/build-order"
  *
  * @returns  {object} {buildOrder: [], purchasedUpgrades: [[], [], [], []], nautName: "Nibbs"}
  */
  this.toString = function(){};

  init(URLData);
};
