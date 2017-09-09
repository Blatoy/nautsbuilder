var NautsBuilder = new function() {
  var self = this;

  this.selectedNaut = false;
  this.nauts = false;
  this.skills = false;
  this.upgrades = false;
  this.buyOrder = [];

  /**
   * Debug function that can be call to check if the spreadsheet is ok. Will add a big black screen with a list of error if any problem is found
   */
  this.skillCheck = function() {
    var txt = "";
    for(var i = 0; i < self.nauts.length; ++i) {
      var naut = this.nauts[i];
      if(!naut.skills) {
        txt = "<b style='color: red;'>Fatal error preventing NB to works. </b> This usually happen if you uploaded invalid data for <b>Characters</b> or <b>Skills</b>. Please fix ASAP!";
      }
      else {
        if(naut.skills.length != 4) {
          txt += naut.name + ": Has " + naut.skills.length + " skills instead of 4!<br>";
        }

        if(!naut.name)
          txt += "A naut is missing a name...";
        if(!naut.icon)
          txt += naut.name + " doesn't have an icon";
        if(!naut.attacktype)
          txt += naut.name + " doesn't have an attackType";
        if(!naut.role)
          txt += naut.name + " doesn't have a role";
        if(!naut.mobility)
          txt += naut.name + " doesn't have a mobility";
        if(!naut.image)
          txt += naut.name + " doesn't have an image";

        for(var j = 0; j < naut.skills.length; j++) {
          var skill = naut.skills[j];

          if(!skill.name)
            txt += naut.name + " - " + skill.description + " is missing a name!<br>";
          if(!skill.icon)
            txt += naut.name + " - " + skill.name + " is missing an icon!<br>";
          if(!skill.description)
            txt += naut.name + " - " + skill.name + " is missing a description!<br>";
          if(!skill.effects)
            txt += naut.name + " - " + skill.effects + " is missing effects!<br>";

          if(!skill.upgrades) {
            txt = "<b style='color: red;'>Fatal error preventing NB to works. </b> This usually happen if you uploaded invalid data for <b>Upgrades</b>. Please fix ASAP!";
          }
          else {
            if(skill.upgrades.length != 6) {
              txt += naut.name + ": Has " + skill.upgrades.length + " upgrades instead of 6!<br>";
            }

            for(var k = 0; k < skill.upgrades.length; k++) {
              var upgrade = skill.upgrades[k];
              if(!upgrade.name)
                txt += naut.name + " - " + upgrade.description + " is missing a name!<br>";
              if(!upgrade.icon)
                txt += naut.name + " - " + upgrade.name + " is missing an icon!<br>";
              if(!upgrade.description)
                txt += naut.name + " - " + upgrade.name + " is missing a description!<br>";
              if(upgrade.cost == undefined)
                txt += naut.name + " - " + upgrade.name + " is missing a cost!<br>";
              if(!upgrade.step1)
                txt += naut.name + " - " + upgrade.name + " is missing a step1!<br>";
            }
          }
        }
      }
    }

    if(txt == "") {
      alert("Spreadsheet test OK.");
    }
    else {
      $("body").append(
        $("<div>")
          .css("position", "fixed")
          .css("background-color", "black")
          .css("top", "0")
          .css("left", "0")
          .css("width", "100%")
          .css("height", "100%")
          .css("z-index", "1001")
          .css("font-family", "Verdana")
          .css("overflow", "auto")
          .html("Invalid data found in the spreadsheet: <br>" + txt)
      )
    }
  };

  /**
   * Add events and load APIs
   */
  this.init = function() {
    //EventManager.addEvent(window, "popstate", self.importBuildFromURL);
    this.loadAPIs();
  };

  /**
   * Query the 3 APIs, parse data when ready
   */
  this.loadAPIs = function() {
    var dataLoadedCount = 0, dataToLoadCount = 3;

    // Load nauts
    $.post(CONFIG.apiURL, {
        action: "nautsbuilder-get-characters"
      }, function(data, textStatus) {
        dataLoadedCount++;
        self.nauts = data;
        UINautList.addNautsToUi(self.nauts);

        // Nauts loaded. Check if skills loaded
        if(self.skills) {
          self.addSkillsToNauts();
          // Nauts and skills loaded. Check if ugprades loaded
          if(self.upgrades) {
            self.addUpgradesToNauts();
          }
        }

        if(dataLoadedCount == dataToLoadCount) {
          if(getURLParameter("b")) {
              self.importBuildFromURL();
          }
        }
      }, "json"
    );

    // Load skills
    $.post(CONFIG.apiURL, {
        action: "nautsbuilder-get-skills"
      }, function(data, textStatus) {
        dataLoadedCount++;
        self.skills = data;

        // Skills loaded. Check if nauts are loaded
        if(self.nauts) {
          self.addSkillsToNauts();
          // Skills and nauts loaded. Check if upgrades are laoded
          if(self.upgrades) {
            self.addUpgradeToSkills();
          }
        }

        if(dataLoadedCount == dataToLoadCount) {
          if(getURLParameter("b")) {
              self.importBuildFromURL();
          }
        }
      }, "json"
    );

    // Load upgrades
    $.post(CONFIG.apiURL, {
        action: "nautsbuilder-get-upgrades"
      }, function(data, textStatus) {
        dataLoadedCount++;
          self.upgrades = data;

          // Upgrades loaded. Check if both nauts and skills are loaded
          if(self.nauts && self.skills) {
            self.addUpgradeToSkills();
          }
          // Since this is the query that should take the more time, we preload naut images after this one
          // Load all nauts image so it doesn't feel laggy when changing the naut
          for(var i = 0; i < self.nauts.length; ++i) {
            preloadImage(self.nauts[i].image);
          }

          if(dataLoadedCount == dataToLoadCount) {
            if(getURLParameter("b")) {
                self.importBuildFromURL();
            }
          }
        }, "json"
      );
  };

  /**
   * Add skills to their respective nauts
   */
  this.addSkillsToNauts = function() {
    for(var i = 0; i < self.skills.length; ++i) {
      var skill = self.skills[i];

      // Some skills aren't assigned to a naut (like jump)
      if(skill.naut) {

        for(var j = 0; j < self.nauts.length; ++j) {
          var naut = self.nauts[j];

          if(skill.naut == naut.name) {
            // Create the array if it doesn't exist
            if(!naut.skills) {
              naut.skills = [skill];
            }
            else {
              naut.skills.push(skill);
            }
          }
        }
      }
    }
  };

  /**
   * Add upgrades to their respective skills
   */
  this.addUpgradeToSkills = function() {
    for(var i = 0; i < self.nauts.length; ++i) {
      var naut = self.nauts[i];
      for(var j = 0; j < naut.skills.length; ++j) {
        var skill = naut.skills[j];
        if(!skill.upgrades) {
          skill.upgrades = [];
        }
        for(var k = 0; k < self.upgrades.length; ++k) {
          var upgrade = self.upgrades[k];
          if(
              (j == 3 && !upgrade.character &&
                (upgrade.usedby == "all" || upgrade.usedby == naut.expansion ||
                  (naut.expansion == "none" && upgrade.usedby == "noExpansion")
                )
              ) || // Global upgrade, only on last row
            (upgrade.character == naut.name && upgrade.skill == skill.name) // Check for the right skill / character
          ) {
            // Replaced upgrade must be added first in the spreadsheet!
            if(upgrade.replaces) {
              for(var l = 0; l < skill.upgrades.length; l++) {
                if(skill.upgrades[l].name == upgrade.replaces) {
                  skill.upgrades[l] = upgrade;
                }
              }
            }
            else {
              skill.upgrades.push(upgrade);
            }
          }
        }
      }
    }
  };

  /**
   * Remove all the upgrade in the buy order
   */
  this.clearBuyOrder = function() {
    this.buyOrder = [];
    UIShop.clearBuyOrder();
  };

  /**
   * Add or remove an element to the buyOrder list and update it
   */
  this.updateBuyOrder = function(upgrade, remove) {
    if(upgrade) {
      if(!remove){
        this.buyOrder.push(upgrade);
      }
      else {
        do {
          this.buyOrder.splice(this.buyOrder.indexOf(upgrade), 1);
        } while(this.buyOrder.indexOf(upgrade) != -1)
      }
    }

    this.updateURL();
    UIShop.updateBuyOrder(this.buyOrder);
  };

  /**
   * Create something like ["Damage"]["Unit"] = 3
   * It does also sum every values
   * @param {object} upgradeEffect - A step1 parsed using SkillParser.parseSkillStep
   * @param {object} currentRow - {data: ..., cost: 0}
   */
  this.updateCurrentRow = function(upgradeEffect, currentRow) {
    for(var key in upgradeEffect) {
      // Key: Damage, Heal, etc
      if(!currentRow.data[key]) {
        currentRow.data[key] = {};
      }

      for(var unit in upgradeEffect[key]) {
        // Key doesn't exist, we set the unit to the current number
        if(!currentRow.data[key][unit]) {
          currentRow.data[key][unit] = upgradeEffect[key][unit];
        }
        else {
          // Key exists and it's a number, we add the value
          if(typeof currentRow.data[key][unit] == "number") {
            currentRow.data[key][unit] += upgradeEffect[key][unit];
          }
          else {
            // Key exists and it's not a tumber
            for(var j in currentRow.data[key][unit]) {
              if(typeof upgradeEffect[key][unit] != "number")
                currentRow.data[key][unit][j] += parseFloat(upgradeEffect[key][unit][j]);
              else
                currentRow.data[key][unit][j] += parseFloat(upgradeEffect[key][unit]);
            }
          }
        }
      }
    }

    return currentRow;
  };

  // TODO Clean this code
  this.updateBuildInfo = function() {
    var totalCost = 0;
    var rowsData = {};

    $(".build-info").html("");

    $("#naut-shop .shop-skill-container").each(function(i, item){
      var row = i;
      var upgradeEffect = SkillParser.parseSkillStep($(this).data("skill-effects"));

      rowsData[row] = {cost: 0, data: []};
      self.updateCurrentRow(upgradeEffect, rowsData[row]);
    });

    $("#naut-shop .shop-item-container").each(function(i, item) {
      var row = Math.floor(i / 6);
      var currentRow = rowsData[row];
      var upgradeStage = $(this).data("upgrade-stage");
      var upgradeCost = $(this).data("upgrade-cost");

      totalCost += upgradeCost * upgradeStage;
      currentRow.cost += upgradeCost * upgradeStage;

      if(upgradeStage != 0) {
        var upgradeEffect = SkillParser.parseSkillStep($(this).data("upgrade-step" + upgradeStage));
        self.updateCurrentRow(upgradeEffect, currentRow);
      }
    });

    for(var key in rowsData) {
      var rowData = rowsData[key];

      $("#build-info-" + (parseInt(key) + 1))
        .append("<span style='float: right;'>" + rowData.cost + " <img style='vertical-align: middle;' src='" + CONFIG.path.images + "solar-icon.png" + "'/></span>")

      for(var effect in rowData.data) {
        var value = rowData.data[effect];
        var damage = "";
        var displayUnit = "%";

        if(value["%"]) { // We need to calculate the %
          damage = value["%"]; // This will be overwritten only if % isn't the only one
          if(typeof value["%"] == "object") { //  We have a % change in a thing like < < <
            for(var unit in value) { // We find which unit need to be updated
              if(unit == "%") {
                continue;
              }
              damage = [];
              for(var j = 0; j < value[unit].length; ++j) {
                displayUnit = unit;
                if(typeof value["%"] != "number") { // Check if the % value is an array or just a value (Ayla's second upgrade)
                  damage.push(round(value[unit][j] * (1 + value["%"][j] / 100)));
                }
                else {
                  damage.push(round(value[unit][j] * (1 + value["%"] / 100)));
                }
              }
            }
          }
          else {
            for(var unit in value) { // We find which unit need to be updated
              if(unit == "%") {
                continue;
              }
              if(typeof value[unit] == "object") {
                for(var j in value[unit]) {
                  damage = round(value[unit][j] * (1 + value["%"] / 100));
                  displayUnit = unit;
                }
              }
              else {
                damage = round(value[unit] * (1 + value["%"] / 100));
                displayUnit = unit;
              }
            }
          }
        }
        else {
          for(var unit in value) {
            damage = value[unit];
            displayUnit = unit;
          }
        }

        displayUnit = displayUnit == "none" ? "" : displayUnit;

        if(typeof damage == "object") {
          displayDamage = "";
          for(var j in damage) {
            displayDamage += damage[j] + displayUnit + " > ";
          }

          displayDamage = displayDamage.substring(0, displayDamage.length - 3);
          displayUnit = "";
        }
        else {
          displayDamage =  damage;
        }

        $("#build-info-" + (parseInt(key) + 1))
          .append(effect + ": <span class='small-text' style='font-size: 0.95em'>" + displayDamage + displayUnit + "</span><br>");
      }
    }

    $("#build-summary").html(
      "Total cost: " + totalCost + "<img style='vertical-align: middle;' src='" + CONFIG.path.images + "/solar-icon.png" + "'/><br>" +
      "Forum link: <input type='text' value='[build]" + self.getExportData() + "[/build]'><br>" +
      "<a href='#' onclick='NautsBuilder.generateImage(" + totalCost + ")'>Export as image</a>" +
      "<hr><a onclick='NautsBuilder.getRandomBuild()' href='#'>Generate random build!</a>"
    );
  };


  /**
   * Swap the place between 2 upgrades in the build order and refresht it
   * @param {number} source - The array index of the source
   * @param {number} target - The array index of the target
   */
  this.swapBuildOrder = function(source, target) {
    var tmp = self.buyOrder[source];

    self.buyOrder[source] = self.buyOrder[target];
    self.buyOrder[target] = tmp;

    UIShop.draggedReorderUpgrade = false;
    self.updateBuyOrder();
  }

  /**
   * Generate a random build for the current character
   */
  this.getRandomBuild = function(){
    $("#naut-icon-" + getValidElementId(self.selectedNaut.name)).click();
    // Generate random build
    var b = "";
    for(var i = 0; i < 4; ++i) {
      b += shuffleString("111000");
    }

    $(".shop-item-container").each(function(i){
      if(b[i] == 1) {
        for(var i = 0; i < $(this).data("upgrade-stage-max"); ++i) {
          $(this).click();
        }
      }
    });

    self.buyOrder = shuffleArray(self.buyOrder);
    self.updateBuyOrder();
  };

  /**
   * Import the build fromthe URL
   */
  this.importBuildFromURL = function() {
    var data = SkillParser.parseURLData(getURLParameter("b"));

    // Select the right naut
    $("#naut-icon-" + getValidElementId(data.name)).click();

    if(data.build) {
      for(var i = 0; i < data.build.length; ++i) {
        var row = Math.floor(i / 7) + 1; // (6 upgrade + 1 skill = 7) + 1 because rows starts at 1 in the HTML
        var col = i % 7 - 1; // (6 upgrade + 1 skill = 7) - 1 because we don't want the skill to be included

        $("#shop-row-" + row + " .shop-item-container").each(function(j, item){
          if(col == j) {
            for(var k = 0; k < data.build[i]; ++k) {
              // Dirty way to select the items. But it prevents http://i.imgur.com/YUJnk9T.png
              $(item).click();
            }
            return false;
          }
        });
      }
    }

    // Set build order
    if(data.order) {
      self.clearBuyOrder();
      for(var i = 0; i < data.order.length; ++i) {
        var row = Math.floor(data.order[i] / 7);
        var col = data.order[i] % 7 - 1;
        self.updateBuyOrder(self.selectedNaut.skills[row].upgrades[col]);
      }
    }

    self.updateBuildInfo();
  };

  /**
   * Get the export data string (Use the same format as NautsBuilder v1)
   * @return {string} str - The string of the build
   */
  this.getExportData = function() {
    // Naut name
    var str = getValidElementId(self.selectedNaut.name);
    // First separator
    str += "/";

    // Item list
    $("#naut-shop .shop-item-upgrade").each(function(index, item){
      // This is just for retro-compatibility with the old nautbuilder
      if(index % 6 == 0)
        str += "1";

      str += $(item).parent().data("upgrade-stage");
    });

     // Second separator
    str += "/";

    for(var i = 0; i < this.buyOrder.length; ++i) {
      str += this.buyOrder[i].index + "-";
    }

    str = str.substring(0, str.length - 1);

    return str;
  };

  /**
   * Return the image containing the build
   */
  this.generateImage = function(totalCost) {
    var str = "";
    var canvas = document.createElement('canvas');

    var ctx = canvas.getContext("2d");
    var solarImg = new Image();
    solarImg.src = CONFIG.path.images + "images/solar-icon.png";

    // TODO: CLEAN THIS CODE (this shouldn't be here)
    $("#export-div").html("");
    $("#export-div").append("Right click > copy as image. Left click will close this box.<br>");
    $("#export-div").append(canvas);
    $("#export-div").show();

    EventManager.addEvent("#export-div", "click", function(){
      $("#export-div").hide();
    });

    $(canvas).css("width", "360px");
    $(canvas).css("height", "360px");

    canvas.width = 360;
    canvas.height = 360;

    ctx.drawImage($("#naut-icon-" + getValidElementId(self.selectedNaut.name))[0], 1, 1, 58, 58);
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.font = "30px Verdana";
    ctx.fillText(self.selectedNaut.name, 70, 28);
    ctx.strokeText(self.selectedNaut.name, 70, 28);
    ctx.font = "20px Verdana";
    ctx.fillText(totalCost, 70, 53);
    ctx.strokeText(totalCost, 70, 53);
    ctx.drawImage(solarImg, 125, 38);

    $("#naut-shop .shop-item-upgrade").each(function(i, item){
      var parent = $(this).parent();
      var w = 60, h = 60;
      var x = (i % 6) * w, y = (Math.floor(i / 6)) * h + 60;

      ctx.drawImage($(this)[0], x, y, w, h);

      if(parent.data("upgrade-stage") == 0) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
        ctx.fillRect(x, y, w, h);
      }
    });

    for(var i = 0; i < self.buyOrder.length; ++i) {
      var w = 30, h = 30;
      var x = (i % 12) * w, y = (Math.floor(i / 12)) * h + 300;
      var img = new Image();
      img.src = self.buyOrder[i].icon;
      ctx.drawImage(img, x, y, w, h);
    }
  };

  /**
   * Add or remove an element to the buyOrder list and update it
   * @param {object} update - The clicked upgrade
   * @param {number} nextUpgradeStage - The upgrade stage that will be set after clicking the item
   */
  this.onItemUpgradeClicked = function(upgrade, nextUpgradeStage) {
    this.updateBuyOrder(upgrade, nextUpgradeStage == 0)
    this.updateBuildInfo();
  };

  /**
   * Update the build data in the URL
   */
  this.updateURL = function() {
    setGetParameter("b", "/nautsbuilder?b=" + self.getExportData());
  };

  /**
   * Reset the shop when a naut is selected
   */
  this.onNautSelected = function(naut) {
    self.clearBuyOrder();
    self.selectedNaut = naut;
    self.updateBuildInfo();
  };
};
