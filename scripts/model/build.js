/**
* var Build - Store informations about the current build
* Just to be clear:
* Effect is something like Damage: +34 or Add flying droid: yes
* Effects are stored like : ["effect name": {value: 3, coefficient: 0.12}]
* Effect are stored in "Steps[]" for upgrades and "Effects" for skills
* A naut has 4 skills and a skill has 6 upgrades
*
* @param  {string} URLData Something like: "Nibbs/1001000100200010010001000000/3" This is actually the same format as the old nautsbuilder
*/
var Build = function(URLData) {
  /**
  * @var purchasedUpgrades - Stores a 2D array of the current stage of an upgrade ([row][col])
  * @var buildOrder - Stores a list of upgrade index (to support old nautsbuilder format, includes skills)
  * @var naut - The naut of this build
  */
  var buildOrder = [], naut = {};
  var errors = [];
  var naut = false;
  var purchasedUpgrades = false;
  var self = this;

  /**
  * this.addError - Used to debug the spreadsheet by storing all invalid thingy that can be fixed in the spreadsheet
  *
  * @param  {string} text A text to help find the error in the spreadsheet
  */
  this.addError = function(text) {
    errors.push(naut.getName() + ": " + text);
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
    var name = "", build = [[0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]], order = false;

    // [0] = nautName [1] = build [2] = build-order
    var data = URLData.split("/");

    name = data[0];
    if(data[1]) {
      //data[1] = data[1].substring(0, 28);
      // We convert the string to a 2 dimensional array where rows are skills and cols are upgrades
      for(var i = 0; i < 28; ++i) {
        // The old nautsbuilder stores the stage for the skill but unlocking skills has been removed from the game
        if(i % 7 === 0) {
          continue;
        }
        if(isNaN(parseInt(data[1][i]))) {
          build[row][i % 7 - 1] = 0;
          continue;
        }

        var row = Math.floor(i / 7);
        build[row][i % 7 - 1] = parseInt(data[1][i]);
      }
    }

    // Build order
    if(data[2]) {
      order = data[2].split("-");
      for(var i = 0; i < order.length; ++i) {
        if(isNaN(parseInt(order[i])) || order[i] <= 0 || order[i] > 27 || order % 7 == 0) {
          order = [];
          break;
        }
      }
    }

    return {nautName: name, purchasedUpgrades: build, order: order};
  };

  /**
  * this.setUpgradeStage - Increment or set the stage of an upgrade
  *
  * @param  {number} row The row where the upgrade is located
  * @param  {number} col The row where the upgrade is located
  * @param  {number} stage Optional. If not specified it will increment the stage by 1 and reset it if > maxStage
  * @return  {number} The stage after setting it
  */
  this.setUpgradeStage = function(row, col, stage){
    if(stage !== undefined) {
      // Note: we actually don't check for the maximum stage if the stage is set manually
      purchasedUpgrades[row][col] = stage;
      this.addUpgradeToBuildOrder(row, col + 1); // + 1 because in the old format you can buy skills
      return stage;
    }
    else {
      var maxUpgradeStage = naut.getSkills()[row].getUpgrades()[col].getStageCount();

      purchasedUpgrades[row][col] = purchasedUpgrades[row][col] + 1 > maxUpgradeStage ? 0 : purchasedUpgrades[row][col] + 1;
      if(purchasedUpgrades[row][col] == 0) {
        this.removeUpgradeFromBuildOrder(row, col + 1);
      }
      else {
        this.addUpgradeToBuildOrder(row, col + 1);
      }
      return purchasedUpgrades[row][col];
    }
  };

  // TODO: Desc
  this.getStageCount = function(row, col) {
    return naut.getSkills()[row].getUpgrades()[col].getStageCount();
  };

  // TODO: Desc
  this.getBuildOrder = function() {
    return buildOrder;
  };

  // TODO: Desc
  this.getUpgradeFromIndex = function(index) {
    var rc = Build.getRowColFromIndex(index - 1);
    var skill = naut.getSkills(rc.row);

    return skill.getUpgrades(rc.col);
  };

  // TODO: Desc
  this.addUpgradeToBuildOrder = function(indexOrRow, col) {
    if(!Array.isArray(buildOrder)) {
      buildOrder = [];
    }
    if(col !== undefined) {
      buildOrder.push(Build.getIndexFromRowCol(indexOrRow, col));
    }
    else {
      buildOrder.push(indexOrRow);
    }
  };

  // TODO: Desc
  this.removeUpgradeFromBuildOrder = function(indexOrRow, col) {
    var index = indexOrRow;
    if(col !== undefined) {
      index = Build.getIndexFromRowCol(indexOrRow, col);
    }
    buildOrder = buildOrder.filter(function(a){ return a != index; });
  };

  // TODO: Desc
  this.removeItemFromBuildOrder = function(index) {
    buildOrder.splice(index, 1);
  };

  // TODO: Desc
  this.addUpgradeToBuildOrderAtIndex = function(upgrade, index) {
    buildOrder.splice(index, 0, upgrade);
  };

  // TODO: Desc
  this.getRowUpgradeCount = function(row) {
    var count = 0;
    for(var i = 0; i < purchasedUpgrades[row].length; ++i) {
      if(purchasedUpgrades[row][i] != 0) {
        ++count;
      }
    }
    return count;
  };

  // TODO: Desc
  this.getUpgradeStage = function(row, col) {
    return purchasedUpgrades[row][col];
  };

  // TODO: Desc
  this.getAllUpgradeStage = function() {
    return purchasedUpgrades;
  };

  /**
  * this.getRowPrice - Get the price of the selected upgrades in a row
  *
  * @param  {number} row The row to get the price. (between 0 - 3)
  */
  this.getRowPrice = function(row){
    var price = 0;
    var upgrades = naut.getSkills()[row].getUpgrades();

    for(var i = 0; i < upgrades.length; ++i) {
      // Upgrade cost * stage. No cost if stage = 0
      price += upgrades[i].getCost() * purchasedUpgrades[row][i];
    }

    return price;
  };

  // TODO: Desc
  this.getPrice = function() {
    var price = 0;
    for(var i = 0; i < 4; ++i) {
      price += this.getRowPrice(i);
    }
    return price;
  };

  /**
  * this.toString - Generate something like "Nibbs/1001000100200010010001000000/3" format: "nautname/purchasedUpgrades/build-order"
  *
  * @returns  {String} something like "Nibbs/1001000100200010010001000000/3" format: "nautname/purchasedUpgrades/build-order"
  */
  this.toString = function() {
    // Naut name
    var str = getCleanString(naut.getName());
    str += "/";

    // Item list
    for(var i = 0; i < purchasedUpgrades.length; ++i) {
      for(var j = 0; j < purchasedUpgrades[i].length; ++j) {
        // We keep a retro-compatibility with the old nautsbuilder format since the skill is also in the URL
        if(j == 0) {
          str += "1";
        }
        str += purchasedUpgrades[i][j] + "";
      }
    }

    // Buy order
    if(Setting.get("buyOrderEnabled")) {
      str += "/";
      for(var i = 0; i < buildOrder.length; ++i) {
        str += buildOrder[i] + "-";
      }
      str = str.substring(0, str.length - 1); // Remove last "-"
    }

    return str;
  };

  /**
  * this.getRowEffects - Get the effects in a row (upgrades current steps + skill effects)
  * Notes:
  * NaN may be returned if someone put a string and a number in the same effect
  *
  * @param  {number} row The row to get a list of effects (between 0 - 3)
  * @returns {object} Something like: {"Skill duration": {value: 234, unit: "s"}, "Damage": {value: 2, unit: ""}}
  */
  this.getRowEffects = function(row){
    var rowEffects = {};

    // Add the effects from the skill.
    // This is easy because rowEffects is empty and skill don't have duplicate effects
    var skill = naut.getSkills(row);
    var skillEffects = skill.getEffects();
    for(var i = 0; i < skillEffects.length; ++i) {
      var skillEffect = skillEffects[i];
      // TODO: Check if value/coeff is array and copy manually the value. They are going to be changed so we can't just copy it...
      rowEffects[skillEffect.getKey()] = JSON.parse(JSON.stringify({value: skillEffect.getValue(), coeff: skillEffect.getCoeff(), unit: skillEffect.getUnit(), scaleType: skillEffect.getEffectScaling()}));
    }

    // Add the effects from upgrades. This require tests to see what to do with the existings effects
    // Now it's the "hard" part because effects may already exists
    var upgrades = skill.getUpgrades();

    for(var col = 0; col < upgrades.length; ++col) {
      var colUpgrade = upgrades[col];
      if(purchasedUpgrades[row][col] !== 0) {
        var colEffects = colUpgrade.getSteps(purchasedUpgrades[row][col] - 1);

        for(var j = 0; j < colEffects.length; ++j) {
          var stepEffect = colEffects[j];
          // Same case as above, the effect doesn't exist so we don't have to check anything

          if(rowEffects[stepEffect.getKey()] === undefined) {
            // We duplicate the array so we are free to change it later
            rowEffects[stepEffect.getKey()] = JSON.parse(JSON.stringify({value: stepEffect.getValue(), coeff: stepEffect.getCoeff(), unit: stepEffect.getUnit(), scaleType: stepEffect.getEffectScaling()}));
          }
          else {
            var existingEffect = rowEffects[stepEffect.getKey()];
            // Now we can have a lot of different effect, including: Strings, number, number array, coeff, coeff array...
            // I could reduce the amount of testing done by imbricate test but it's more readable this way and take less space...
            if(Array.isArray(stepEffect.getValue()) && Array.isArray(existingEffect.value)) {
              // Both array
              for(var k = 0; k < stepEffect.getValue().length; ++k) {
                // Check if array are the same size, they should but...
                if(existingEffect.value[k] !== undefined) {
                  existingEffect.value[k] += stepEffect.getValue(k);
                }
                else {
                  existingEffect.value.push(stepEffect.getValue(k));
                }
              }
            }
            else if(Array.isArray(stepEffect.getValue()) && !Array.isArray(existingEffect.value)){
              // New effect is array but old effect isn't
              // If one is an array but the other isn't, we add the value to each cell of the array
              var oldValue = existingEffect.value;
              existingEffect.value = [];
              for(var k = 0; k < stepEffect.getValue().length; ++k) {
                existingEffect.value.push(oldValue + stepEffect.getValue(k));
              }
            }
            else if(!Array.isArray(stepEffect.getValue()) && Array.isArray(existingEffect.value)){
              // Old effect is array but new effect isn't
              for(var k = 0; k < existingEffect.value.length; ++k) {
                existingEffect.value[k] += stepEffect.getValue();
              }
            }
            else {
              // Both aren't
              existingEffect.value += stepEffect.getValue();
            }

            // Now we do the same zork for coeff. It could be an idea to create a function
            if(Array.isArray(stepEffect.getCoeff()) && Array.isArray(existingEffect.coeff)) {
              // Both array
              for(var k = 0; k < stepEffect.getCoeff().length; ++k) {
                // Check if array are the same size, they should but...
                if(existingEffect.coeff[k] !== undefined) {
                  existingEffect.coeff[k] += stepEffect.getCoeff(k);
                }
                else {
                  existingEffect.coeff.push(stepEffect.getCoeff(k));
                }
              }
            }
            else if(Array.isArray(stepEffect.getCoeff()) && !Array.isArray(existingEffect.coeff)){
              // New effect is array but old effect isn't
              // If one is an array but the other isn't, we add the value to each cell of the array
              var oldCoeff = existingEffect.coeff;
              existingEffect.coeff = [];
              for(var k = 0; k < stepEffect.getCoeff().length; ++k) {
                existingEffect.coeff.push(oldCoeff + stepEffect.getCoeff(k));
              }
            }
            else if(!Array.isArray(stepEffect.getCoeff()) && Array.isArray(existingEffect.coeff)){
              // Old effect is array but new effect isn't
              for(var k = 0; k < existingEffect.coeff.length; ++k) {
                existingEffect.coeff[k] += stepEffect.getCoeff();
              }
            }
            else {
              // Both aren't
              existingEffect.coeff += stepEffect.getCoeff();
            }
          }
        }
      }
    }

    // Now that everything should be OK; We still have to "value *= 1 + coeff", add DPS, limit the digit to 2 and check for team level
    var dpsAttackSpeed = {}, dpsDamage = {}, dpsMultiplier = {}, dotDpsDamage = 0, dotDpsDuration = 0, dotDpsScaleType = "";
    for(var k in rowEffects) {
      var effect = rowEffects[k];

      // And let's go for the stupid array check again
      if(Array.isArray(effect.value) && Array.isArray(effect.coeff)) {
        // Both array
        // If they aren't the same size, I don't really know what to do, it just means there's an error in the spreadsheet
        for(var i = 0; i < effect.value.length; ++i) {
          effect.value[i] = round(effect.value[i] * (1 + effect.coeff[i]));
          effect.value[i] = Build.getValueAfterTeamScaling(effect.value[i], effect.scaleType);
        }
      } else if(Array.isArray(effect.value) && !Array.isArray(effect.coeff)) {
        // Value is array but coeff isn't
        for(var i = 0; i < effect.value.length; ++i) {
          effect.value[i] = round(effect.value[i] * (1 + effect.coeff));
          effect.value[i] = Build.getValueAfterTeamScaling(effect.value[i], effect.scaleType);
        }
      } else if(!Array.isArray(effect.value) && Array.isArray(effect.coeff)) {
        // Coeff is array but value isn't
        var tempValue = effect.value;

        effect.value = [];
        for(var i = 0; i < effect.coeff.length; ++i) {
          //  effect.value.push(Build.getValueAfterTeamScaling(round((1 + effect.coeff[i]) * tempValue)), effect.scaleType);
          // No value means the upgrade only has a %
          if(tempValue === 0) {
            effect.value.push(Build.getValueAfterTeamScaling(round((effect.coeff[i]) * 100), effect.scaleType));
          }
          else {
            effect.value.push(Build.getValueAfterTeamScaling(round((1 + effect.coeff[i]) * tempValue)), effect.scaleType);
          }
        }
      } else {
        // Both are value
        if(isNumeric(effect.value)) {
          if(effect.value === 0) {
            // No value means the upgrade only has a %
            effect.value = (effect.coeff) * 100;
            effect.value = Build.getValueAfterTeamScaling(effect.value, effect.scaleType);
          }
          else {
            // If no coeff, it will just multiply the value by 1
            effect.value = round(effect.value * (1 + effect.coeff));
            effect.value = Build.getValueAfterTeamScaling(effect.value, effect.scaleType);
          }
        }
        // else it's a string and so coeff isn't required
      }

      // Find keys that allows us to calculate DPS
      // (Attack speed / 60 * Damage) * Damage Multiplier
      if(CONFIG.dpsCalculationRegex.speed.test(k)) {
        var speedType = CONFIG.dpsCalculationRegex.speed.exec(k)[1];
        dpsAttackSpeed[speedType] = effect.value;
      }
      if(CONFIG.dpsCalculationRegex.damage.test(k)) {
        var damageType = CONFIG.dpsCalculationRegex.damage.exec(k)[1];
        dpsDamage[damageType] = effect.value;
      }
      if(CONFIG.dpsCalculationRegex.multiplier.test(k)) {
        var multiplierType = CONFIG.dpsCalculationRegex.multiplier.exec(k)[1];
        dpsMultiplier[multiplierType] = effect.value;
      }

      switch(k) {
        case "damage over time":
          dotDpsScaleType = effect.scaleType;
          dotDpsDamage = Build.reverseTeamScaling(effect.value, effect.scaleType);
        break;
        case "damage duration": dotDpsDuration = Build.reverseTeamScaling(effect.value, effect.scaleType); break;
      }
    }

    // Dot dps calculation
    if(dotDpsDuration !== 0 && dotDpsDamage !== 0) {
      rowEffects["Dot DPS"] = {unit: "", value: round(Build.getValueAfterTeamScaling(dotDpsDamage / dotDpsDuration, dotDpsScaleType)), coeff: 1};
    }

    // Dps calculation
    for(var k in dpsAttackSpeed) { // We take dpsAttackSpeed but we could also check dpsDamage
      if(dpsDamage[k] !== undefined) {
        var dps = [];
        if(dpsMultiplier[k] === undefined) {
          dpsMultiplier[k] = 1;
        }

        if(Array.isArray(dpsMultiplier[k])) {
           // TODO: Handle it properly
           // There's currently no case that require an array of multiplier but this may be something nice to do
          dpsMultiplier[k] = dpsMultiplier[k][0];
        }

        if(Array.isArray(dpsDamage[k]) && Array.isArray(dpsAttackSpeed[k])) {
          // They must be the same size here or it won't just work...
          for(var i = 0; i < dpsDamage.length; ++i) {
            dps.push(round(dpsAttackSpeed[k][i] / 60 * dpsDamage[k][i] * dpsMultiplier[k]));
          }
        } else if(!Array.isArray(dpsDamage[k]) && Array.isArray(dpsAttackSpeed[k])) {
          for(var i = 0; i < dpsAttackSpeed[k].length; ++i) {
            dps.push(round(dpsAttackSpeed[k][i] / 60 * dpsDamage[k] * dpsMultiplier[k]));
          }
        } else if(Array.isArray(dpsDamage[k]) && !Array.isArray(dpsAttackSpeed[k])) {
          for(var i = 0; i < dpsDamage[k].length; ++i) {
            dps.push(round(dpsAttackSpeed[k] / 60 * dpsDamage[k][i] * dpsMultiplier[k]));
          }
        } else {
          dps = round(dpsAttackSpeed[k] / 60 * dpsDamage[k] * dpsMultiplier[k]);
        }

        rowEffects[k + "DPS"] = {unit: "", value: dps, coeff: 1};
      }
    }
    return rowEffects;
  };

  // TODO: Desc
  this.reset = function() {
    buildOrder = [];
    naut = false;
    purchasedUpgrades = [[0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]];
  };

  // TODO: Desc
  this.drawBuildOnCanvas = function(ctx, canvas) {
    var solarIcon = new Image();
    var nautIcon = new Image();
    var lockedImage = new Image();
    var shopBackground = new Image();

    var y = 35, x = 70;

    solarIcon.src = CONFIG.path.images + "solar-icon.png"; // Should be loaded instantly since it's in cache
    lockedImage.src = CONFIG.path.images + "locked.png" // Should be loaded instantly since it's in cache
    nautIcon.src = this.getNaut().getIcon(); // Should be loaded instantly since it's in cache
    shopBackground.src = CONFIG.path.images + "shop-hexagon.png";

    // Bg
    ctx.fillStyle = "rgba(0, 31, 51, 0.8)";
    ctx.fillRect(0, 0, 360, 400);
    ctx.drawImage(shopBackground, 0, 0)
    ctx.drawImage(shopBackground, 0, 280)
    // Naut name
    ctx.fillStyle = "white";
    ctx.font = "20px Verdana";
    ctx.fillText(this.getNaut().getName(), x, y);
    // Cost
    ctx.font = "15px Verdana";
    ctx.fillStyle = "#00A0A0";
    ctx.fillText("Cost: " + this.getPrice(), x, y + 20);
    ctx.drawImage(solarIcon, ctx.measureText("Cost: " + this.getPrice()).width + x + 3, y + 7);
    // Naut icon
    ctx.drawImage(nautIcon, 10, 10, 50, 50);

    // Upgrades
    var skills = this.getNaut().getSkills();
    for(var i = 0; i < skills.length; ++i) {
      for(var j = 0; j < skills[i].getUpgrades().length; ++j) {
        var img = new Image();
        img.src = skills[i].getUpgrades(j).getIcon();
        var x1 = 2 + j * 60;
        var y1 = y + 33 + 60 * i;

        if(this.getUpgradeStage(i, j) == 0 && Build.current.getRowUpgradeCount(i) != 3) {
          // Upgrade not bought but row not full
          ctx.globalAlpha = 0.3;
          ctx.drawImage(img, x1, y1, 58, 58);
          ctx.globalAlpha = 1.0;
        }
        else if(this.getUpgradeStage(i, j) == 0 &&  Build.current.getRowUpgradeCount(i) == 3) {
          // Upgrade not bought but row full
          ctx.globalAlpha = 0.7;
          ctx.drawImage(lockedImage, x1, y1, 58, 58);
          ctx.globalAlpha = 1.0;
        }
        else {
          // Uprade bought
          ctx.drawImage(img, x1, y1, 58, 58);
        }
      }
    }
    // Build order
    if(Setting.get("buyOrderEnabled")) {
      var y2 = 325, imgCount = 12;

      for(var i = 0; i < buildOrder.length; ++i) {
        var upgrade = this.getUpgradeFromIndex(buildOrder[i]);
        var img = new Image();
        img.src = upgrade.getIcon();
        var w = 360 / imgCount;
        ctx.drawImage(img, 2 + (i % imgCount) * w, y2 + Math.floor(i / imgCount) * w, w - 2, w - 2)
      }
    }
  };

  // TODO: Desc
  this.setNaut = function(character){
    this.reset();
    naut = character;
  };

  // TODO: Desc
  this.setRandomBuild = function(){
    buildOrder = [];
    for(var i = 0; i < 4; ++i) {
      var s = shuffleString("111000");
      for(var j = 0; j < s.length; ++j) {
        purchasedUpgrades[i][j] = parseInt(s.charAt(j));
        if(purchasedUpgrades[i][j] != 0) {
          purchasedUpgrades[i][j] = naut.getSkills()[i].getUpgrades()[j].getStageCount()
          for(var k = 0; k < purchasedUpgrades[i][j]; ++k) {
            buildOrder.push(Build.getIndexFromRowCol(i, j + 1));
          }
        }
      }
    }
    shuffleArray(buildOrder);
  };

  // TODO: Desc
  this.swapBuildOrderElement = function(initialIndex, finalIndex){
    var tmp = buildOrder[initialIndex];
    buildOrder[initialIndex] = buildOrder[finalIndex];
    buildOrder[finalIndex] = tmp;
  };

  // TODO: Desc
  this.moveBuildOrderElement = function(itemIndex, posIndex) {
    buildOrder.splice(posIndex, 0, buildOrder[itemIndex]);
  };

  // TODO: Desc
  this.setFromData = function(URLData) {
    if(URLData) {
      var build = self.getFromURL(URLData);
      buildOrder = build.order;
      purchasedUpgrades = build.purchasedUpgrades;

      if(buildOrder == false) {
        ShopView.showBuildOrderPanel(false);
        Setting.set("buyOrderEnabled", false, true);
        buildOrder = [];

        // We still fill the build order with the upgrade to prevent an empty buy order when upgrades are bought
        for(var i = 0; i < build.purchasedUpgrades.length; ++i) {
          for(var j = 0; j < build.purchasedUpgrades[i].length; ++j) {
            // 1 id per stage
            for(var k = 0; k < build.purchasedUpgrades[i][j]; ++k) {
              buildOrder.push(Build.getIndexFromRowCol(i, j + 1));
            }
          }
        };
      }

      naut = Naut.getByName(build.nautName);
    }
  };

  // Get the current naut
  this.getNaut = function() {
    return naut;
  };

  this.debugPrintBuild = function() {
    /* Paste the code below in the console to display the debug shop for penny
    b = new Build();
    b.setNaut(Naut.list[20]); b.debugPrintBuild(); */
    $("#debug").remove();
    $("body").append(
      $("<div/>")
        .css("white-space", "pre")
        .css("background-color", "white")
        .css("color", "black")
        .css("font-family", "consolas")
        .attr("id", "debug")
        .html(" - " + naut.getName() + " -<br>Skills              Shop         Cost     Effects<br>")
    );

    var txt = ["", "", "", ""];

    for(var i = 0; i < naut.getSkills().length; ++i) {
      txt[i] += "* " + naut.getSkills()[i].getName().padEnd(17, " ");
    }

    for(var i = 0; i < purchasedUpgrades.length; i++) {
      for(var j = 0; j < purchasedUpgrades[i].length; ++j) {
        txt[i] += " <a href='#' onclick='b.setUpgradeStage("+i+", "+j+"); b.debugPrintBuild()'>" + purchasedUpgrades[i][j] + "</a>";
      }
    }

    for(var i = 0; i < 4; ++i) {
      txt[i] += "  " + (self.getRowPrice(i) + "").padEnd(3, " ") + "      ";
      var rowEffects = self.getRowEffects(i);
      for(var k in rowEffects) {
        if(Array.isArray(rowEffects[k].value)) {
          txt[i] += k + ": " + rowEffects[k].value.join(" > ")  + "" + (rowEffects[k].unit == "none" ? "" : rowEffects[k].unit) + "; ";
        }
        else {
          txt[i] += k + ": " + rowEffects[k].value  + "" + (rowEffects[k].unit == "none" ? "" : rowEffects[k].unit) + "; ";
        }
      }
    }

    for(var i = 0; i < txt.length; ++i) {
      $("#debug").append(txt[i] + "<br>");
    }
  };
};

// TODO: Desc
Build.getIndexFromRowCol = function(row, col) {
  return 7 * row + col;
};

// TODO: Desc
Build.getRowColFromIndex = function(index) {
  return {col: index % 7, row: Math.floor(index / 7)};
};

// TODO: Desc
Build.getScalingFromEffectTypeAndLevel = function(effectType) {
  var teamLevel = parseInt(Setting.get("teamLevel") - 1);

  switch(effectType) {
    case "heal": return parseFloat(CONFIG.healscaling) * teamLevel;
    case "damage": return parseFloat(CONFIG.damagescaling) * teamLevel;
    default: return 0;
  }
};

// TODO: Desc
Build.getValueAfterTeamScaling = function(value, scaleType) {
  return round(value * (1 + Build.getScalingFromEffectTypeAndLevel(scaleType)));
};

Build.reverseTeamScaling = function(value, scaleType) {
  return round(value / (1 + Build.getScalingFromEffectTypeAndLevel(scaleType)));
};
