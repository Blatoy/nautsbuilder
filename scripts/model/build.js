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
  * @var buildOrder - Stores a list of upgrade index (to support old nautsbuilder format)
  * @var naut - The naut of this build
  */
  var buildOrder = [], naut = {};
  var errors = [];
  var purchasedUpgrades = [[0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]];
  var self = this;

  /**
  * var init - "Constructor" for this "class"
  *
  * @param  {string} URLData See class description
  */
  var init = function(URLData){
    if(URLData) {
      var build = self.getFromURL(URLData);
      buildOrder = build.order;
      purchasedUpgrades = build.purchasedUpgrades;
      naut = Naut.getByName(build.nautName);
    }
  };

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
    var name = "", build = [], order = false;

    // [0] = nautName [1] = build [2] = build-order
    var data = URLData.split("/");

    name = data[0];
    if(data[1]) {
      // We convert the string to a 2 dimensional array where rows are skills and cols are upgrades
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
  * this.setUpgradeStage - Increment or set the stage of an upgrade
  *
  * @param  {number} row The row where the upgrade is located
  * @param  {number} col The row where the upgrade is located
  * @param  {number} stage Optional. If not specified it will increment the stage by 1 and reset it if > maxStage
  */
  this.setUpgradeStage = function(row, col, stage){
    if(stage !== undefined) {
      // Note: we actually don't check for the maximum stage if the stage is set manually
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
    var upgrades = naut.getSkills()[row].getUpgrades();

    for(var i = 0; i < upgrades.length; ++i) {
      // Upgrade cost * stage. No cost if stage = 0
      price += upgrades[i].getCost() * purchasedUpgrades[row][i];
    }

    return price;
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
      rowEffects[skillEffect.getKey()] = JSON.parse(JSON.stringify({value: skillEffect.getValue(), coeff: skillEffect.getCoeff(), unit: skillEffect.getUnit()}));
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
            // TODO: Check if value/coeff is array and copy manually the value. They are going to be changed so we can't just copy it...
            rowEffects[stepEffect.getKey()] = JSON.parse(JSON.stringify({value: stepEffect.getValue(), coeff: stepEffect.getCoeff(), unit: stepEffect.getUnit()}));
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

    // Now that everything should be OK; We still have to "value *= 1 + coeff", add DPS and limit the digit to 2
    var dpsAttackSpeed = 0, dpsDamage = 0, dpsMultiplier = 1;
    for(var k in rowEffects) {
      var effect = rowEffects[k];

      // And let's go for the stupid array check again
      if(Array.isArray(effect.value) && Array.isArray(effect.coeff)) {
        // Both array
        // If they aren't the same size, I don't really know what to do, it just means there's an error in the spreadsheet
        for(var i = 0; i < effect.value.length; ++i) {
          effect.value[i] = round(effect.value[i] * (1 + effect.coeff[i]));
        }
      } else if(Array.isArray(effect.value) && !Array.isArray(effect.coeff)) {
        // Value is array but coeff isn't
        for(var i = 0; i < effect.value.length; ++i) {
          effect.value[i] = round(effect.value[i] * (1 + effect.coeff));
        }
      } else if(!Array.isArray(effect.value) && Array.isArray(effect.coeff)) {
        // Coeff is array but value isn't
        var tempValue = effect.value;
        effect.value = [];
        for(var i = 0; i < effect.coeff.length; ++i) {
          effect.value.push(round((1 + effect.coeff[i]) * tempValue));
        }
      } else {
        // Both are value
        if(isNumeric(effect.value)) {
          if(effect.value === 0) {
            // No value means the upgrade only has a %
            effect.value = effect.coeff * 100;
          }
          else {
            // If no coeff, it will just multiply the value by 1
            effect.value = round(effect.value * (1 + effect.coeff));
          }
        }
        // else it's a string and so coeff isn't required
      }

      // DPS Calculation
      // (Attack speed / 60 * Damage) * Damage Multiplier ?
      // TODO: Don't hardcode this and read it from the spreadsheet
      switch(k) {
        case "attack speed": dpsAttackSpeed = effect.value; break;
        case "damage": dpsDamage = effect.value; break;
        case "damage multiplier": dpsMultiplier = effect.value; break;
      }
    }

    if(dpsAttackSpeed !== 0 && dpsDamage !== 0) {
      console.log("...");
      var dps = [];
      if(Array.isArray(dpsMultiplier)) {
         // TODO: Handle it properly
         // There's currently no case that require an array of multiplier but this may be something nice to do
        dpsMultiplier = dpsMultiplier[0];
      }

      if(Array.isArray(dpsDamage) && Array.isArray(dpsAttackSpeed)) {
        // They must be the same size here or it won't just work...
        for(var i = 0; i < dpsDamage.length; ++i) {
          dps.push(dpsAttackSpeed[i] / 60 * dpsDamage[i] * dpsMultiplier);
        }
      } else if(!Array.isArray(dpsDamage) && Array.isArray(dpsAttackSpeed)) {
        for(var i = 0; i < dpsAttackSpeed.length; ++i) {
          dps.push(dpsAttackSpeed[i] / 60 * dpsDamage * dpsMultiplier);
        }
      } else if(Array.isArray(dpsDamage) && !Array.isArray(dpsAttackSpeed)) {
        for(var i = 0; i < dpsDamage.length; ++i) {
          dps.push(dpsAttackSpeed / 60 * dpsDamage[i] * dpsMultiplier);
        }
      } else {
        dps = dpsAttackSpeed / 60 * dpsDamage * dpsMultiplier;
      }

      rowEffects.DPS = {unit: "", value: dps, coeff: 1};
    }

    return rowEffects;
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
