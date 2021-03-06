/**
 * let Build - Store informations about the current build
 * Just to be clear:
 * Effect is something like Damage: +34 or Add flying droid: yes
 * Effects are stored like : ["effect name": {value: 3, coefficient: 0.12}]
 * Effect are stored in "Steps[]" for upgrades and "Effects" for skills
 * A naut has 4 skills and a skill has 6 upgrades
 *
 * @param  {string} URLData Something like: "Nibbs/1001000100200010010001000000/3" This is actually the same format as the old nautsbuilder
 */
let Build = function(URLData) {
  /**
   * @let purchasedUpgrades - Stores a 2D array of the current stage of an upgrade ([row][col])
   * @let buildOrder - Stores a list of upgrade index (to support old nautsbuilder format, includes skills)
   * @let naut - The naut of this build
   */
  let buildOrder = [];
  let errors = [];
  let naut = false;
  let purchasedUpgrades = false;
  let self = this;

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
  this.getFromURL = function(URLData) {
    // "nautName/build/build-order"
    // Nibbs/1000000100000010010001000000/17-15-12-11
    let name = "",
      build = [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0]
      ],
      order = false;

    // [0] = nautName [1] = build [2] = build-order
    let data = URLData.split("/");

    name = data[0];
    if (data[1]) {
      //data[1] = data[1].substring(0, 28);
      // We convert the string to a 2 dimensional array where rows are skills and cols are upgrades
      for (let i = 0; i < 28; ++i) {
        // The old nautsbuilder stores the stage for the skill but unlocking skills has been removed from the game
        if (i % 7 === 0) {
          continue;
        }
        if (isNaN(parseInt(data[1][i]))) {
          build[row][i % 7 - 1] = 0;
          continue;
        }

        let row = Math.floor(i / 7);
        build[row][i % 7 - 1] = parseInt(data[1][i]);
      }
    }

    // Build order
    if (data[2]) {
      order = data[2].split("-");
      // Old build order doens't use the same format because it contains skills
      // It's possible to detect if it's an old building using buildOrder length
      // This means, all incomplete build from nautsbuilder1 won't have a build order / an invalid one
      // The idea is the same however it's index - 1 and index 1 and 8 should be ignorer
      let uniqueOrder = order.filter(function(item, pos) {
        return order.indexOf(item) == pos
      });
      let useOldBuildOrder = uniqueOrder.length == 14;

      if (useOldBuildOrder) {
        for (let i = 0; i < order.length; ++i) {
          if (isNaN(parseInt(order[i])) || order[i] <= 0 || order[i] > 28) {
            order = [];
            break;
          } else {
            // We remove 1 and 8 since they are skills and this is not handled by nb2
            if (order[i] == 1 || order[i] == 8) {
              order.splice(i, 1);
              i--;
            } else {
              // Old build index = new build index + 1 so we fix it
              order[i]--;
            }
          }
        }
      } else {
        for (let i = 0; i < order.length; ++i) {
          if (isNaN(parseInt(order[i])) || order[i] <= 0 || order[i] > 27) {
            order = [];
            break;
          }
        }
      }
    }

    return {
      nautName: name,
      purchasedUpgrades: build,
      order: order
    };
  };

  /**
   * this.setUpgradeStage - Increment or set the stage of an upgrade
   *
   * @param  {number} row The row where the upgrade is located
   * @param  {number} col The row where the upgrade is located
   * @param  {number} stage Optional. If not specified it will increment the stage by 1 and reset it if > maxStage
   * @return  {number} The stage after setting it
   */
  this.setUpgradeStage = function(row, col, stage) {
    if (stage !== undefined) {
      // Note: we actually don't check for the maximum stage if the stage is set manually
      purchasedUpgrades[row][col] = stage;
      this.addUpgradeToBuildOrder(row, col + 1); // + 1 because in the old format you can buy skills
      return stage;
    } else {
      let maxUpgradeStage = naut.getSkills()[row].getUpgrades()[col].getStageCount();

      purchasedUpgrades[row][col] = purchasedUpgrades[row][col] + 1 > maxUpgradeStage ? 0 : purchasedUpgrades[row][col] + 1;
      if (purchasedUpgrades[row][col] == 0) {
        this.removeUpgradeFromBuildOrder(row, col + 1);
      } else {
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
    let rc = Build.getRowColFromIndex(index - 1);
    let skill = naut.getSkills(rc.row);

    return skill.getUpgrades(rc.col);
  };

  // TODO: Desc
  this.addUpgradeToBuildOrder = function(indexOrRow, col) {
    if (!Array.isArray(buildOrder)) {
      buildOrder = [];
    }
    if (col !== undefined) {
      buildOrder.push(Build.getIndexFromRowCol(indexOrRow, col));
    } else {
      buildOrder.push(indexOrRow);
    }
  };

  // TODO: Desc
  this.removeUpgradeFromBuildOrder = function(indexOrRow, col) {
    let index = indexOrRow;
    if (col !== undefined) {
      index = Build.getIndexFromRowCol(indexOrRow, col);
    }
    buildOrder = buildOrder.filter(function(a) {
      return a != index;
    });
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
    let count = 0;
    for (let i = 0; i < purchasedUpgrades[row].length; ++i) {
      if (purchasedUpgrades[row][i] != 0) {
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
  this.getRowPrice = function(row) {
    let price = 0;
    let upgrades = naut.getSkills()[row].getUpgrades();

    for (let i = 0; i < upgrades.length; ++i) {
      // Upgrade cost * stage. No cost if stage = 0
      price += upgrades[i].getCost() * purchasedUpgrades[row][i];
    }

    return price;
  };

  // TODO: Desc
  this.getPrice = function() {
    let price = 0;
    for (let i = 0; i < 4; ++i) {
      price += this.getRowPrice(i);
    }
    return price;
  };

  /**
   * this.toString - Generate something like "Nibbs/1001000100200010010001000000/3" format: "nautname/purchasedUpgrades/build-order"
   *
   * @returns  {String} something like "Nibbs/1001000100200010010001000000/3" format: "nautname/purchasedUpgrades/build-order"
   */
  this.toString = function(enableRetrocompatibility) {
    // Naut name
    let str = getCleanString(naut.getName());
    str += "/";

    // Item list
    for (let i = 0; i < purchasedUpgrades.length; ++i) {
      for (let j = 0; j < purchasedUpgrades[i].length; ++j) {
        // We keep a retro-compatibility with the old nautsbuilder format since the skill is also in the URL
        if (j == 0) {
          str += "1";
        }

        str += purchasedUpgrades[i][j] + "";
      }
    }

    // Buy order
    if (Setting.get("buyOrderEnabled")) {
      str += "/";
      if (enableRetrocompatibility == true) {
        str += "1-8-"
        for (let i = 0; i < buildOrder.length; ++i) {
          str += (parseInt(buildOrder[i]) + 1) + "-";
        }
      } else {
        // Doesn't put the skill, and index = index -1
        // This was done by mistake but can't be changed since a lot of link use this system
        for (let i = 0; i < buildOrder.length; ++i) {
          str += buildOrder[i] + "-";
        }
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
  this.getRowEffects = function(row) {
    let rowEffects = {};

    // Add SKILL EFFECTS
    // rowEffects is empty and there are no duplicates at the moment
    let skill = naut.getSkills(row);
    let skillEffects = skill.getEffects();
    for (let i = 0; i < skillEffects.length; ++i) {
      let skillEffect = skillEffects[i];
      // TODO: Check if value/coeff is array and copy manually the value. They are going to be changed so we can't just copy it...
      rowEffects[skillEffect.getKey()] = JSON.parse(JSON.stringify({
        value: this.resolveCrossRow(skillEffect.getValue()),
        coeff: this.resolveCrossRow(skillEffect.getCoeff()),
        unit: skillEffect.getUnit(),
        scaleType: skillEffect.getEffectScaling()
      }));
    }

    // Add UPGRADES EFFECTS
    // Some effects may already exist so we need to check for that
    let upgrades = skill.getUpgrades();
    for (let col = 0; col < upgrades.length; ++col) {
      let colUpgrade = upgrades[col];

      if (colUpgrade.getSpecialEffect() == "AFFECT_ALL") {
        // Upgrades that affect all other upgrades don't need to add their stats
        continue;
      }

      // Upgrade is purchased
      if (purchasedUpgrades[row][col] !== 0) {
        let colEffects = colUpgrade.getSteps(purchasedUpgrades[row][col] - 1);
        // For each effect...
        for (let j = 0; j < colEffects.length; ++j) {
          let stepEffect = colEffects[j];

          // Does it already exist?
          if (rowEffects[stepEffect.getKey()] === undefined) {
            // No => Same as if it was new, nothing to do
            rowEffects[stepEffect.getKey()] = JSON.parse(JSON.stringify({
              value: this.resolveCrossRow(stepEffect.getValue()),
              coeff: this.resolveCrossRow(stepEffect.getCoeff()),
              unit: stepEffect.getUnit(),
              scaleType: stepEffect.getEffectScaling()
            }));
          } else {
            // Yes => We merge the values
            let existingEffect = rowEffects[stepEffect.getKey()];
            existingEffect.value = mergeValues(existingEffect.value, this.resolveCrossRow(stepEffect.getValue()));
            existingEffect.coeff = mergeValues(existingEffect.coeff, this.resolveCrossRow(stepEffect.getCoeff()));

            // Forces to use no unit instead of percentage
            if (existingEffect.unit == "%" && stepEffect.getUnit() == "none") {
              existingEffect.unit = "none";
            }
          }
        }
      }
    }

    // Check for special effects that would affect this row
    for (let i = 0; i < naut.getSkills().length; ++i) {
      for (let j = 0; j < naut.getSkills(i).getUpgrades().length; ++j) {
        let upgrade = naut.getSkills(i).getUpgrades(j);
        switch (upgrade.getSpecialEffect()) {
          case "AFFECT_ALL":
            // Check if the upgrade was bought
            if (purchasedUpgrades[i][j] !== 0) {
              // Apply effects to the existing effects
              let effectsToApply = upgrade.getSteps(purchasedUpgrades[i][j] - 1);
              for (let k = 0; k < effectsToApply.length; ++k) {
                let newEffect = effectsToApply[k];
                if (rowEffects[newEffect.getKey()] !== undefined) {
                  rowEffects[newEffect.getKey()].value = mergeValues(rowEffects[newEffect.getKey()].value, this.resolveCrossRow(newEffect.getValue()));
                  rowEffects[newEffect.getKey()].coeff = mergeValues(rowEffects[newEffect.getKey()].coeff, this.resolveCrossRow(newEffect.getCoeff()));
                }
              }
            }

            break;
        }
      }
    }

    // It's possible to have multiple source of DPS, but only 1 kind of DOTps is possible
    let dpsAttackSpeed = {},
      dpsDamage = {},
      dpsMultiplier = {};
    let dotDpsDamage = 0,
      dotDpsDuration = 0,
      dotDpsScaleType = "";

    // Apply COEFFICIENT and track DPS/DOTps
    for (let k in rowEffects) {
      let effect = rowEffects[k];
      // Both array
      // We make sure we don't try to do this to a string
      if (typeof effect.value !== "string") {
        if (Array.isArray(effect.value) && Array.isArray(effect.coeff)) {
          // NOTE: Only the size of effect.value is taken into account
          for (let i = 0; i < effect.value.length; ++i) {
            if (effect.coeff[i] !== undefined) {
              effect.value[i] = Build.applyTeamScaling(Build.applyCoeff(effect.value[i], effect.coeff[i]), effect.scaleType);
            }
          }
        } else if (!Array.isArray(effect.value) && !Array.isArray(effect.coeff)) {
          // Both values
          effect.value = Build.applyTeamScaling(Build.applyCoeff(effect.value, effect.coeff), effect.scaleType);
        } else if (Array.isArray(effect.value) && !Array.isArray(effect.coeff)) {
          // Value is array, coeff isn't
          for (let i = 0; i < effect.value.length; ++i) {
            effect.value[i] = Build.applyTeamScaling(Build.applyCoeff(effect.value[i], effect.coeff), effect.scaleType);
          }
        } else {
          // Value is number, coeff is array
          let tempArray = [];
          for (let i = 0; i < effect.coeff.length; ++i) {
            tempArray.push(Build.applyTeamScaling(Build.applyCoeff(effect.value, effect.coeff[i]), effect.scaleType));
          }
          effect.value = tempArray;
        }
      }

      // DPS (we check for keywords to claculate DPS)
      // (Attack speed / 60 * Damage) * Damage Multiplier
      if (CONFIG.dpsCalculationRegex.speed.test(k)) {
        let speedType = CONFIG.dpsCalculationRegex.speed.exec(k)[1];
        dpsAttackSpeed[speedType] = effect.value;
      }
      if (CONFIG.dpsCalculationRegex.damage.test(k)) {
        let damageType = CONFIG.dpsCalculationRegex.damage.exec(k)[1];
        dpsDamage[damageType] = effect.value;
      }
      if (CONFIG.dpsCalculationRegex.multiplier.test(k)) {
        let multiplierType = CONFIG.dpsCalculationRegex.multiplier.exec(k)[1];
        dpsMultiplier[multiplierType] = effect.value;
      }

      // Remove team scaling for dotPS as we will apply it later
      switch (k) {
        case "damage over time":
          dotDpsScaleType = effect.scaleType;
          dotDpsDamage = Build.reverseTeamScaling(effect.value, effect.scaleType);
          break;
        case "damage duration":
          dotDpsDuration = Build.reverseTeamScaling(effect.value, effect.scaleType);
          break;
      }
    }

    // DOT DPS calculation
    if (dotDpsDuration !== 0 && dotDpsDamage !== 0) {
      rowEffects["Dot DPS"] = {
        unit: "",
        value: round(Build.applyTeamScaling(dotDpsDamage / dotDpsDuration, dotDpsScaleType)),
        coeff: 1
      };
    }

    // DPS calculation (it's an object because there can be multiple DPS like Ink DPS and Anchor DPS)
    for (let k in dpsAttackSpeed) {
      // Is dpsDamage defined too?
      if (dpsDamage[k] !== undefined) {

        let dps = [];
        // dpsDamage is required, but we can have dps without dpsMultiplier
        if (dpsMultiplier[k] === undefined) {
          dpsMultiplier[k] = 1;
        }

        // TODO There's currently no cases that require an array of multiplier but this may be something that wneed to be implemented
        if (Array.isArray(dpsMultiplier[k])) {
          dpsMultiplier[k] = dpsMultiplier[k][0];
        }

        if (Array.isArray(dpsDamage[k]) && Array.isArray(dpsAttackSpeed[k])) {
          for (let i = 0; i < dpsDamage[k].length; ++i) {
            dps.push(Build.applyDPS(dpsAttackSpeed[k][i], dpsDamage[k][i], dpsMultiplier[k]));
          }
        } else if (!Array.isArray(dpsDamage[k]) && !Array.isArray(dpsAttackSpeed[k])) {
          dps = Build.applyDPS(dpsAttackSpeed[k], dpsDamage[k], dpsMultiplier[k]);
        } else if (!Array.isArray(dpsDamage[k]) && Array.isArray(dpsAttackSpeed[k])) {
          // Attack speed is array, dps isn't
          for (let i = 0; i < dpsAttackSpeed[k].length; ++i) {
            dps.push(Build.applyDPS(dpsAttackSpeed[k][i], dpsDamage[k], dpsMultiplier[k]));
          }
        } else if (Array.isArray(dpsDamage[k]) && !Array.isArray(dpsAttackSpeed[k])) {
          // dps is array, damaage isn't
          for (let i = 0; i < dpsDamage[k].length; ++i) {
            dps.push(Build.applyDPS(dpsAttackSpeed[k], dpsDamage[k][i], dpsMultiplier[k]));
          }
        }

        rowEffects[k + "DPS"] = {
          unit: "",
          value: dps,
          coeff: 1
        };
      }
    }
    return rowEffects;
  };

  // val1 and val2 is array => ret[i] = val1[i] + val2[i]
  // val1 and val2 are number => ret = val1 + val2
  // val1 is array, val2 is number => ret[i] = val1[i] + val2
  // val2 is array, val1 is number => ret[i] = val2[i] + val1
  let mergeValues = function(val1, val2) {
    // Both value are array
    if (Array.isArray(val1) && Array.isArray(val2)) {
      let res = [];
      let count = val1.length > val2.length ? val1.length : val2.length;
      // We just add the value together or 0 if they doesn't exist
      for (let i = 0; i < count; ++i) {
        res.push((val1[i] === undefined ? 0 : val1[i]) + (val2[i] === undefined ? 0 : val2[i]));
      }

      return res;
    }

    // Both aren't array
    if (!Array.isArray(val1) && !Array.isArray(val2)) {
      return val1 + val2;
    } else {
      // One of the value is an array
      let array = Array.isArray(val1) ? val1 : val2;
      let number = Array.isArray(val1) ? val2 : val1;

      for (let i = 0; i < array.length; ++i) {
        array[i] += number;
      }

      return array;
    }
  }

  // TODO: Desc
  this.reset = function() {
    buildOrder = [];
    naut = false;
    purchasedUpgrades = [
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0]
    ];
  };

  // TODO: Desc
  this.drawBuildOnCanvas = function(ctx, canvas) {
    let solarIcon = new Image();
    let nautIcon = new Image();
    let lockedImage = new Image();
    let shopBackground = new Image();

    let y = 35,
      x = 70;

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
    let skills = this.getNaut().getSkills();
    for (let i = 0; i < skills.length; ++i) {
      for (let j = 0; j < skills[i].getUpgrades().length; ++j) {
        let img = new Image();
        img.src = skills[i].getUpgrades(j).getIcon();
        let x1 = 2 + j * 60;
        let y1 = y + 33 + 60 * i;

        if (this.getUpgradeStage(i, j) == 0 && Build.current.getRowUpgradeCount(i) != 3) {
          // Upgrade not bought but row not full
          ctx.globalAlpha = 0.3;
          ctx.drawImage(img, x1, y1, 58, 58);
          ctx.globalAlpha = 1.0;
        } else if (this.getUpgradeStage(i, j) == 0 && Build.current.getRowUpgradeCount(i) == 3) {
          // Upgrade not bought but row full
          ctx.globalAlpha = 0.7;
          ctx.drawImage(lockedImage, x1, y1, 58, 58);
          ctx.globalAlpha = 1.0;
        } else {
          // Uprade bought
          ctx.drawImage(img, x1, y1, 58, 58);
        }
      }
    }
    // Build order
    if (Setting.get("buyOrderEnabled")) {
      let y2 = 325,
        imgCount = 12;

      for (let i = 0; i < buildOrder.length; ++i) {
        let upgrade = this.getUpgradeFromIndex(buildOrder[i]);
        let img = new Image();
        img.src = upgrade.getIcon();
        let w = 360 / imgCount;
        ctx.drawImage(img, 2 + (i % imgCount) * w, y2 + Math.floor(i / imgCount) * w, w - 2, w - 2)
      }
    }
  };

  // TODO: Desc
  this.setNaut = function(character) {
    this.reset();
    naut = character;
  };

  // TODO: Desc
  this.setRandomBuild = function() {
    buildOrder = [];
    for (let i = 0; i < 4; ++i) {
      let s = shuffleString("111000");
      for (let j = 0; j < s.length; ++j) {
        purchasedUpgrades[i][j] = parseInt(s.charAt(j));
        if (purchasedUpgrades[i][j] != 0) {
          purchasedUpgrades[i][j] = naut.getSkills()[i].getUpgrades()[j].getStageCount()
          for (let k = 0; k < purchasedUpgrades[i][j]; ++k) {
            buildOrder.push(Build.getIndexFromRowCol(i, j + 1));
          }
        }
      }
    }
    shuffleArray(buildOrder);
  };

  // TODO: Desc
  this.swapBuildOrderElement = function(initialIndex, finalIndex) {
    let tmp = buildOrder[initialIndex];
    buildOrder[initialIndex] = buildOrder[finalIndex];
    buildOrder[finalIndex] = tmp;
  };

  // TODO: Desc
  this.moveBuildOrderElement = function(itemIndex, posIndex) {
    buildOrder.splice(posIndex, 0, buildOrder[itemIndex]);
  };

  // TODO: Desc
  this.setFromData = function(URLData) {
    if (URLData) {
      let build = self.getFromURL(URLData);
      buildOrder = build.order;
      purchasedUpgrades = build.purchasedUpgrades;

      if (buildOrder == false) {
        ShopView.showBuildOrderPanel(false);
        Setting.set("buyOrderEnabled", false, true);
        buildOrder = [];

        // We still fill the build order with the upgrade to prevent an empty buy order when upgrades are bought
        for (let i = 0; i < build.purchasedUpgrades.length; ++i) {
          for (let j = 0; j < build.purchasedUpgrades[i].length; ++j) {
            // 1 id per stage
            for (let k = 0; k < build.purchasedUpgrades[i][j]; ++k) {
              buildOrder.push(Build.getIndexFromRowCol(i, j + 1));
            }
          }
        };
      }

      naut = Naut.getByName(build.nautName);
    }
  };

  this.resolveCrossRow = function(values) {
    // Debug: No resolving
    if (Setting.get("debugDisableCrossRowParser")) return values;

    // Force everything to be an array as it's easier for values like 0 > 1 > 2 > ...
    let array = Array.isArray(values) ? values : [values];
    for (let i = 0; i < array.length; ++i) {
      let res = array[i] + ""; // Force string conversion

      // Replace |row,col| by 1 if the upgade was purchased, 0 otherwise
      res = res.replace(/\|([0-9]*?),([0-9]*?)\|/g, function(match, row, col) {
        return purchasedUpgrades[row][col] == 0 ? 0 : 1; // I prefer having 0 or 1 than a falsy/trusy value since it will be parsed using a math lib
      });

      // Replace |row,col,index|
      res = res.replace(/\|([0-9]*?),([0-9]*?),([0-9]*?)\|/g, function(match, row, col, index) {
        let stage = purchasedUpgrades[row][col] - 1;
        if (stage === -1) {
          return 0;
        } else {
          if (self.getNaut().getSkills(row).getUpgrades(col).getSteps(stage)[index].getValue() != 0) {
            return self.getNaut().getSkills(row).getUpgrades(col).getSteps(stage)[index].getValue();
          } else {
            return self.getNaut().getSkills(row).getUpgrades(col).getSteps(stage)[index].getCoeff();
          }
        }
      });

      // Replace ¦row, index¦ Get Same as |row,col,index| but for skills
      res = res.replace(/\¦(.+?),(.+?)\¦/g, function(match, row, index) {
        if (self.getNaut().getSkills(row).getEffects()[index].getValue() != 0) {
          return self.getNaut().getSkills(row).getEffects()[index].getValue();
        } else {
          return self.getNaut().getSkills(row).getEffects()[index].getCoeff();
        }
      });

      if (!Setting.get("debugDisableMathParser")) {
        // Math eval of everything inside []
        res = res.replace(/\[(.*?)\]/g, function(match, capture) {
          try {
            return math.eval(capture);
          } catch (err) {
            console.error("Math evaluation failed for " + capture);
          }
          // Something failed, return 0
          return 0;
        });
      }

      // math.eval
      // Make sure to recreate a number if it was a number ot keep the string
      if (isNumeric(res)) {
        res = parseFloat(res);
      }
      array[i] = res;
    }

    if (Array.isArray(values)) {
      return array;
    } else {
      return array[0];
    }
  }

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
      .text(" - " + naut.getName() + " -<br>Skills              Shop         Cost     Effects<br>")
    );

    let txt = ["", "", "", ""];

    for (let i = 0; i < naut.getSkills().length; ++i) {
      txt[i] += "* " + naut.getSkills()[i].getName().padEnd(17, " ");
    }

    for (let i = 0; i < purchasedUpgrades.length; i++) {
      for (let j = 0; j < purchasedUpgrades[i].length; ++j) {
        txt[i] += " <a href='#' onclick='b.setUpgradeStage(" + i + ", " + j + "); b.debugPrintBuild()'>" + purchasedUpgrades[i][j] + "</a>";
      }
    }

    for (let i = 0; i < 4; ++i) {
      txt[i] += "  " + (self.getRowPrice(i) + "").padEnd(3, " ") + "      ";
      let rowEffects = self.getRowEffects(i);
      for (let k in rowEffects) {
        if (Array.isArray(rowEffects[k].value)) {
          txt[i] += k + ": " + rowEffects[k].value.join(" > ") + "" + (rowEffects[k].unit == "none" ? "" : rowEffects[k].unit) + "; ";
        } else {
          txt[i] += k + ": " + rowEffects[k].value + "" + (rowEffects[k].unit == "none" ? "" : rowEffects[k].unit) + "; ";
        }
      }
    }

    for (let i = 0; i < txt.length; ++i) {
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
  return {
    col: index % 7,
    row: Math.floor(index / 7)
  };
};

// TODO: Desc
Build.getScalingFromEffectTypeAndLevel = function(effectType) {
  let teamLevel = parseInt(Setting.get("teamLevel") - 1);

  switch (effectType) {
    case "heal":
      return parseFloat(CONFIG.healscaling) * teamLevel;
    case "damage":
      return parseFloat(CONFIG.damagescaling) * teamLevel;
    default:
      return 0;
  }
};

// TODO: Desc
Build.applyDPS = function(attackSpeed, damage, multiplier) {
  return round(attackSpeed / 60 * damage * multiplier);
}

// TODO: Desc
Build.applyCoeff = function(value, coeff) {
  if (value === 0) {
    return 100 * coeff; // No value => it's a %
  } else {
    return value * (1 + coeff);
  }
}

// TODO: Desc
Build.applyTeamScaling = function(value, scaleType) {
  return round(value * (1 + Build.getScalingFromEffectTypeAndLevel(scaleType)));
};

// DPS and DOTps are affected by team scaling so we just reverse it before displaying...
Build.reverseTeamScaling = function(value, scaleType) {
  return round(value / (1 + Build.getScalingFromEffectTypeAndLevel(scaleType)));
};