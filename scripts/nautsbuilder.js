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
    EventManager.addEvent(window, "popstate", self.importBuildFromURL);
    this.loadAPIs();
  };

  /**
   * Query the 3 APIs, parse data when ready
   */
  this.loadAPIs = function() {
    var dataLoadedCount = 0, dataToLoadCount = 3;

    // Load nauts
    $.post(API_URL, {
        action: "nautsbuilder-get-characters"
      }, function(data, textStatus) {
        dataLoadedCount++;
        self.nauts = data;
        UIManager.addNautsToUi(self.nauts);

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
    $.post(API_URL, {
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
    $.post(API_URL, {
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
    // The first upgrades must be the global one or "replaces" may not work!
    for(var i = 0; i < self.upgrades.length; ++i) {
      var upgrade = self.upgrades[i];

      if(upgrade.character) {
        // Character specific upgrade
        for(var j = 0; j < self.nauts.length; ++j) {
          var naut = self.nauts[j];

          if(naut.name == upgrade.character) {
            // Found the right naut
            for(var k = 0; k < naut.skills.length; ++k) {
              var skill = naut.skills[k];

              if(skill.name == upgrade.skill) {
                // Found the right skill
                // Check if it replaces another skill
                if(upgrade.replaces) {
                  // Skills can only be replaced in the last row
                  var lastRowSkill = naut.skills[naut.skills.length - 1];

                  for(var l = 0; l < lastRowSkill.upgrades.length; ++l) {
                    // Found an upgrade to replace
                    if(lastRowSkill.upgrades[l].name == upgrade.replaces) {
                      lastRowSkill.upgrades[l] = upgrade;
                      break;
                    }
                  }
                }
                else {
                  // No replaces, just add the upgrade to the skill list
                  if(!skill.upgrades) {
                    skill.upgrades = [upgrade]
                  }
                  else {
                    skill.upgrades.push(upgrade);
                  }
                }
              }
            }
          }
        }
      }
      else {
        // "Global" upgrades (i = 0...8 should pass here)
        for(var j = 0; j < self.nauts.length; ++j) {
          var naut = self.nauts[j];
          // Get the last skill row
          var skill = naut.skills[naut.skills.length - 1];
          // Check the globalUpgrades list to see who will need which upgrade
          for(var k = 0; k < globalUpgrades.length; ++k) {
            var gUpgrade = globalUpgrades[k];
            if(gUpgrade.name == upgrade.name) {
              // All nauts have the same upgrades except the expansion one
              if(gUpgrade.usedBy == "all" || gUpgrade.usedBy == naut.expansion || (gUpgrade.usedBy == "noExpansion" && naut.expansion == "none")) {
                if(!skill.upgrades) {
                  skill.upgrades = [upgrade]
                }
                else {
                  skill.upgrades.push(upgrade);
                }
              }
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
    UIManager.clearBuyOrder();
  };

  /**
   * Add or remove an element to the buyOrder list and update it
   */
  this.updateBuyOrder = function(upgrade, remove) {
    if(!remove){
      this.buyOrder.push(upgrade);
    }
    else {
      do {
        this.buyOrder.splice(this.buyOrder.indexOf(upgrade), 1);
      } while(this.buyOrder.indexOf(upgrade) != -1)
    }

    UIManager.updateBuyOrder(this.buyOrder);
  };

  // TODO
  this.updateBuildInfo = function() {
    // TEMP DATA
    $(".build-info").html("This will contain stats about your build soon (tm)");
    $("#build-summary").html(
      "Forum link: <input type='text' value='[build]" + self.getExportData() + "[/build]'>"
    );
    /*$(".build-info").html("");
    var totalSolarCost = 0, solarCostLine = 0;
    var txt = "";
    var categories = {}; // Damage, duration, etc.
    var skillLoaded = false;
    // Add the main upgrade to the list

    // Foreach item in the shop
    $("#naut-shop .shop-item-container").each(function(i, item) {
      var upgrade = $(item);
      // Solar track
      totalSolarCost += upgrade.data("upgrade-cost") * upgrade.data("upgrade-stage");
      solarCostLine += upgrade.data("upgrade-cost") * upgrade.data("upgrade-stage");

      // Create the description, calcul damage, %, etc
      if(upgrade.data("upgrade-stage") != 0) {

        var step = upgrade.data("upgrade-step" + upgrade.data("upgrade-stage"));
        var formatedSteps = self.parseSkillStep(step);
        if(!skillLoaded) {
          // Dirty way to load skills info
          var skillSteps = self.parseSkillStep($("#shop-row-" + (1 + Math.floor(i / 6)) + " .shop-item-skill").data("skill-effects"));
          Object.assign(formatedSteps, skillSteps);
          skillLoaded = true;
        }

        for(var k in formatedSteps) {
          if(!categories[k]) {
            categories[k]= {};
          }
          // k2 is the unit, k1 is "Damamage", "Duration", etc.
          for(var k2 in formatedSteps[k]) {
            if(categories[k][k2]) {
              categories[k][k2] += formatedSteps[k][k2];
            }
            else {
              categories[k][k2] = formatedSteps[k][k2];
            }
          }
        }
      }

      if((i + 1) % 6 == 0) {
        for(var k in categories)  {
          var categoryAffectedByPercentage = false;
          var categoryUnit = "%";
          for(var k2 in categories[k]) {
            if(k2 != "%") {
              categoryUnit = k2;
              if(categories[k]["%"]) {
                categoryAffectedByPercentage = true;
                categories[k][k2] *= 1 + (categories[k]["%"] / 100);
              }
            }
          }

          var categoryDisplay = categoryUnit == "none" ? "" : categoryUnit;
          txt += "<span class='build-description-category'>" + k + ":</span> "
             + (isNumeric(categories[k][categoryUnit]) ? Math.round(categories[k][categoryUnit] * 100) / 100 : categories[k][categoryUnit])
             + categoryDisplay + "<br>";
        }

        $("#build-info-" + Math.round((i + 1) / 6)).html(
          "<div style='float:right;' class='shop-cost'>Cost: " + solarCostLine + " <img style='vertical-align:middle; ' src='http://i.imgur.com/o1BDqpK.png'></div>" + txt
        );

        // Reset "lines" variables
        categories = {};
        solarCostLine = 0;
        txt = "";
        skillLoaded = false;
      }
    });

    $("#build-summary").html(
      "Total cost: " + totalSolarCost + "<img style='vertical-align:middle; ' src='http://i.imgur.com/o1BDqpK.png'><br>" +
      "Forum link: <input type='text' value='[build]" + self.getExportData() + "[/build]'>"
    );*/
  };

  /**
   * Import the build fromthe URL
   */
  this.importBuildFromURL = function() {
    var data = SkillParser.parseURLData(getURLParameter("b"));

    // Select the right naut
    $("#naut-icon-" + data.name.replace(/ /g, "_")).click();

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
    var str = self.selectedNaut.name;
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
   * Add or remove an element to the buyOrder list and update it
   * @param {object} update - The clicked upgrade
   * @param {number} nextUpgradeStage - The upgrade stage that will be set after clicking the item
   */
  this.onItemUpgradeClicked = function(upgrade, nextUpgradeStage) {
    // TODO: Something may be wrong here (maybe) now I don't remember what it is and this is dumb
    this.updateBuyOrder(upgrade, nextUpgradeStage == 0)
    this.updateBuildInfo();
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
