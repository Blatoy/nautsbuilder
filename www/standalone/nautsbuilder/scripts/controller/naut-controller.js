/**
 * let NautController - Handle everything related to nauts
 * Upgrades are moved into skills once loaded and skills are moved to nauts
 */
let NautController = new function() {
  let self = this;
  let apiLoaded = false; // Prevent APIs to be loaded twice
  let apiToLoadCount = 6; // Used to track when everything is loaded.
  // TODO: Move misc API somewhere else
  this.API = {
    CHARACTERS: "nautsbuilder-get-characters",
    UPGRADES: "nautsbuilder-get-upgrades",
    SKILLS: "nautsbuilder-get-skills",
    CONTRIBUTORS: "nautsbuilder-get-contributors",
    CONFIG: "nautsbuilder-get-config",
    EFFECTS: "nautsbuilder-get-effects"
  };

  this.nautSelected = false;
  this.canHoverNautSelection = true;

  /**
   * this.init - "Constructor" for this "class" should be called when all the scripts are ready to be used
   */
  this.init = function() {
    let cacheVersion = localStorage.getItem("cacheVersion");

    // Force using cache if the website cannot be reached
    timeout = setTimeout(loadAllAPIs, 3000);
    // Check if the cache is up to date
    queryAPI("nautsbuilder-get-version", function(data, textStatus) {
      clearTimeout(timeout);

      if (cacheVersion != "-1" && parseInt(cacheVersion) != parseInt(data)) {
        console.log("Cache outdated! CV: " + cacheVersion + " NV:" + data + " - Local cache deleted!");
        self.clearAPICache();
      }

      if (cacheVersion != "-1") {
        localStorage.setItem("cacheVersion", data);
      } else {
        console.log("Cache auto-updating disabled!");
      }
      loadAllAPIs();
    });

    $("#naut-list").on("mouseleave", function() {
      self.canHoverNautSelection = true;
      if (self.nautSelected) {
        ShopView.displayShop();
        ShopView.displayBuyOrder();
        NautView.hideArt();
        NautView.hideName();
        InfoBoxView.displayAbout();
        InfoBoxView.hideLore();
        InfoBoxView.hideSkills();
      }
    });
  };

  // TODO: Desc
  let loadAllAPIs = function() {
    if (apiLoaded) {
      return;
    }

    apiLoaded = true;
    for (let k in self.API) {
      loadAPI(self.API[k]);
    }
  };

  // TODO: Desc
  this.clearAPICache = function() {
    for (let k in self.API) {
      localStorage.removeItem(self.API[k]);
    }
  };

  /**
   * let loadAPI - Query the specified API if no local cache is found
   */
  let loadAPI = function(API) {
    let data = localStorage.getItem(API);

    if (Setting.get("disableCache") || data === null) {
      if (Setting.get("disableCache")) {
        console.log("Cache disable in settings");
      } else {
        console.log("No cache found for " + API + ". Loading data from server.");
      }

      queryAPI(API, function(data, textStatus) {
        if (data) {
          localStorage.setItem(API, JSON.stringify(data));
          onAPILoaded(API, data);
        } else {
          // TODO: Error handling
        }
      });
    } else {
      console.log("Using cache for " + API)
      onAPILoaded(API, JSON.parse(data));
    }
  };

  /**
   * let onAPILoaded - Called each time an API is loaded, when all API are loaded
   * addUpgradesToSkills() and addSkillsToNauts() are called
   */
  let onAPILoaded = function(API, data) {
    switch (API) {
      case self.API.CHARACTERS:
        for (let i = 0; i < data.length; ++i) {
          if (data[i].beta != 2 || Setting.get("debugDisplayNaut")) {
            Naut.list.push(new Naut(data[i]));
          }
        }
        break;
      case self.API.SKILLS:
        for (let i = 0; i < data.length; ++i) {
          Skill.list.push(new Skill(data[i]));
        }
        break;
      case self.API.UPGRADES:
        for (let i = 0; i < data.length; ++i) {
          Upgrade.list.push(new Upgrade(data[i]));
        }
        break;
      case self.API.CONTRIBUTORS:
        contributors = data;
        break;
      case self.API.CONFIG:
        for (let k in data[0]) {
          // Prevent replacing existing things
          if (!CONFIG[k]) {
            CONFIG[k] = data[0][k];
          }
        }
        break;
    }

    apiToLoadCount--;
    if (apiToLoadCount === 0) {
      onAllAPILoaded();
    }
  };

  let onAllAPILoaded = function() {
    // All API Loaded
    addSkillsToNauts();
    addUpgradesToSkills();
    MainView.onLoaded();
    InfoBoxView.onLoaded();
    NautView.displayNautList(Naut.list);
    NautView.addRandomIconToNautList();

    let buildData = getURLData();
    if (buildData !== false && buildData != "") {
      Build.current.setFromData(buildData);
      BuildController.setAllViews();

      ShopView.updateAllUpgradeStage();

      self.canHoverNautSelection = true;
      self.nautSelected = true;

      $(".naut-icon").each(function() {
        if ($(this).attr("title") == Build.current.getNaut().getName()) {
          $(this).addClass("selected");
        }
      });

      ShopView.updateBuildOrderDisplay();
    }

    // We preload all splash art because they display faster if we do it
    for (let i = 0; i < Naut.list.length; ++i) {
      preloadImage(Naut.list[i].getSplashArt());
    }
  };

  /**
   * let addUpgradesToSkills - Link upgrades to their skill, also performs check
   * to add global skills
   */
  let addUpgradesToSkills = function() {
    let upgrades = Upgrade.list;
    let nauts = Naut.list;

    for (let i = 0; i < nauts.length; ++i) {
      let naut = nauts[i];
      let skills = naut.getSkills();

      for (let j = 0; j < skills.length; ++j) {
        let skill = skills[j];
        for (let k = 0; k < upgrades.length; ++k) {
          let upgrade = upgrades[k];

          // In summary:
          // check if the naut own the upgrade and
          // we're in the last row and the upgrade is not attached to any naut and
          // if the upgrade is used by everyone (e.g. piggy) or naut's expansion = upgrade's expansion or
          // if the upgrade is for no expansion only and the naut hasn't an expansion
          // or the upgrade has a character attched to it so we don't really care
          if ((
              j == 3 && upgrade.getCharacter() === undefined && (
                upgrade.getUsedBy() == Upgrade.USED_BY_ALL ||
                upgrade.getUsedBy() == naut.getExpansion() ||
                (naut.getExpansion() == Naut.EXPANSION_NONE && upgrade.getUsedBy() == Upgrade.USED_BY_NO_EXPANSION)
              )
            ) ||
            (upgrade.getCharacter() == naut.getName() && upgrade.getSkillName() == skill.getName())
          ) {
            // This will only allow to replace an upgrade that have already been added!
            // Always add ugprade that replaces another at the end of the spreadsheet
            if (upgrade.getReplaces() !== undefined) {
              for (let l = 0; l < skill.getUpgrades().length; l++) {
                if (upgrade.getReplaces() == skill.getUpgrades()[l].getName()) {
                  skill.replaceUpgrade(l, upgrade);
                  break;
                }
              }
            } else {
              skill.addUpgrade(upgrade);
            }
          }
        }
      }
    }
  };

  /**
   * let addSkillsToNauts - Link skills to their naut.
   */
  let addSkillsToNauts = function() {
    for (let i = 0; i < Skill.list.length; ++i) {
      let skill = Skill.list[i];
      for (let j = 0; j < Naut.list.length; ++j) {
        let naut = Naut.list[j];

        if (skill.getCharacter() == naut.getName()) {
          naut.addSkill(skill);
          break; // NB: This may be a cause of error
        }
      }
    }
  };

  /**
   * this.addSkillsToNauts - Replaces the current (api) cache by data
   * API is automatically detected from data. Prevent the cache to be automatically updated
   */
  this.debugSetTempSpreadsheetData = function(data) {
    let d = JSON.parse(data);
    if (d[0]) {
      let e = d[0];
      $("#custom-import").val("Refresh to apply.");
      if (localStorage.getItem("cacheVersion") != "-1") {
        localStorage.setItem("cacheVersion", "-1");
        alert("Cache auto-updating has been disabled. Setting > Clear cache to enable it again.")
      }

      if (e.ischaracterstab) {
        localStorage.setItem(NautController.API.CHARACTERS, data);
      } else if (e.isskillstab) {
        localStorage.setItem(NautController.API.SKILLS, data);
      } else if (e.isupgradestab) {
        localStorage.setItem(NautController.API.UPGRADES, data);
      } else if (e.iseffectstab) {
        localStorage.setItem(NautController.API.EFFECTS, data);
      } else if (e.isconfigtab) {
        localStorage.setItem(NautController.API.CONFIG, data);
      } else {
        $("#custom-import").val("Invalid data");
      }
    }
  };

  // TODO: Add desc
  this.selectNaut = function(nautName, keepCurrentBuild) {
    NautView.moveNautSelectionToRight();
    NautView.hideArt();
    NautView.hideName();
    InfoBoxView.hideSkills();
    InfoBoxView.hideLore();
    InfoBoxView.displayAbout();
    this.nautSelected = true;
    this.canHoverNautSelection = false;
    if (!keepCurrentBuild) {
      BuildController.onNautSelected(Naut.getByName(nautName));
    }
    /*  Build.current = new Build();
      Build.setNaut("...");*/
  };

  // TODO: Add desc
  this.selectRandomNaut = function() {
    NautView.moveNautSelectionToRight();
    let randomNaut = Naut.list[Math.floor(Naut.list.length * Math.random())];
    NautView.setSelectedNaut(NautView.getIconElementForNaut(randomNaut));
    NautView.hideName();
    NautView.hideArt();
    InfoBoxView.hideSkills();
    InfoBoxView.hideLore();
    InfoBoxView.displayAbout();
    this.nautSelected = true;
    this.canHoverNautSelection = false;
    BuildController.onNautSelected(randomNaut);
    BuildController.setRandomBuild()
  };

  // TODO: Add desc
  this.previewNaut = function(nautName) {
    // Prevent displaying nauts info after selecting a naut
    if (!this.canHoverNautSelection) {
      return;
    }
    let naut = Naut.getByName(nautName);
    InfoBoxView.displaySkills(naut);
    InfoBoxView.displayLore(naut);
    ShopView.hideShop();
    ShopView.hideBuyOrder();
    NautView.displayName(naut);
    NautView.displayArt(naut);
  };

  // TODO: Add desc
  this.previewRandomNaut = function() {
    // Prevent displaying nauts info after selecting a naut
    if (!this.canHoverNautSelection) {
      return;
    }
    ShopView.hideShop();
    ShopView.hideBuyOrder();
    InfoBoxView.displayRandomNaut();
    NautView.displayRandomNaut();
  };
};
