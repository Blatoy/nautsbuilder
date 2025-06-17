  /**
   * let Upgrade - Describes an upgrade, see the spreadsheet for more details
   * Instances of this class are stored in a Skill
   * @param  {JSONObject} upgradeAPIData The data taken from the API for a single Upgrade
   */
  let Upgrade = function(upgradeAPIData) {
    let self = this;
    let upgradeData = false;
    let steps = [];
    let devNames = [];

    /**
     * let init - "Constructor" for this "class"
     * Stores naut data in the class
     * @param  {JSONObject} upgradeAPIData See class description
     */
    let init = function(upgradeAPIData) {
      if (!upgradeAPIData) {
        console.error("upgrade.js: constructor can't be called without args");
        return false;
      } else {
        upgradeData = upgradeAPIData;
        // Get upgrade stage effects and dev names
        for (let i = 0; i < Upgrade.MAX_STEP_AVAILABLE; ++i) {
          if (upgradeData["step" + (i + 1)] !== undefined) {
            let rawEffects = upgradeData["step" + (i + 1)].split(Effect.EFFECT_SEPARATOR);
            let effectScaling = [];
            if (upgradeData.effectscaling) {
              effectScaling = upgradeData.effectscaling.split(Effect.EFFECT_SEPARATOR) || [];
            }
            let effects = [];

            for (let j = 0; j < rawEffects.length; ++j) {
              if (rawEffects[j].replace(/\s/g, "") !== "") {
                // Prevent NB2 being stuck in a state that prevent cache refresh
                if (!effectScaling[j]) {
                  console.error("Missing effect scaling for " + upgradeData.skill + "'s' " + upgradeData.name);
                }
                effects.push(new Effect(rawEffects[j], effectScaling[j] ? effectScaling[j].replace(" ", "") : "none"));
              }
            }
            steps.push(effects);
          }

          if (upgradeData["devname" + (i + 1)] !== undefined) {
            devNames.push(upgradeData["devname" + (i + 1)]);
          }
        }
      }
    };

    this.toString = function() {
      let txt = "",
        row = 0,
        col = 0;

      if (Setting.get("debugRCIDisplay")) {
        for (let i = 0; i < Build.current.getNaut().getSkills().length; ++i) {
          for (let j = 0; j < Build.current.getNaut().getSkills(i).getUpgrades().length; ++j) {
            if (Build.current.getNaut().getSkills(i).getUpgrades(j).getName() == this.getName()) {
              txt += "|" + i + "," + j + "| ";
              row = i, col = j;
            }
          }
        }
      }

      txt += "<b>" + htmlToText(this.getName()) + "</b>";
      txt += "<br><br>";
      txt += "<img style='vertical-align: middle;' src='" + CONFIG.path.images + "solar-icon.png'/>" + htmlToText(this.getCost());
      txt += "";
      for (let i = 0; i < this.getSteps().length; ++i) {
        txt += "<br><br>Stage " + (i + 1) + "<span class='tooltip-upgrades'>";
        for (let j = 0; j < this.getSteps(i).length; ++j) {
          let effectValueText = this.getSteps(i)[j].toString();
          // Effects that have no text are hidden
          if (effectValueText == "") continue;
          if (!Setting.get("debugRCIDisplay")) {
            txt += "<br>- " + effectValueText;
          } else {
            txt += "<br>|" + row + "," + col + "," + j + "| " + effectValueText;
          }
        }
        txt += "</span>";
      }
      txt += "<br><br>";
      txt += "<span class='small-text'>" + htmlToText(this.getDescription()) + "</span>";

      // TODO: Press ctrl + click to copy dev name
      if (Setting.get("displayDevNames")) {
        let devNames = this.getDevName();
        if (devNames.length != 0) {
          txt += "<hr><span class='small-text'><b>Dev name</b>";
          for (let i = 0; i < devNames.length; ++i) {
            txt += "<br>Stage " + (i + 1) + ": " + htmlToText(devNames[i]);
          }

          txt += "</span>";
        } else {
          txt += "<hr><span class='small-text'><b>Dev name missing for this upgrade.</b>";
        }
      }

      return txt;
    };

    /**
     * this.getCharacter - Getter
     *
     * @returns {string}  The name of the Naut who own this upgrade
     */
    this.getCharacter = function() {
      return upgradeData.character;
    };

    /**
     * this.getSpecialEffect - Getter
     *
     * @returns {string}  The special effect of this upgrade or false if it doesn't have one
     */
    this.getSpecialEffect = function() {
      if (upgradeData.specialeffect && upgradeData.specialeffect != "") {
        return upgradeData.specialeffect;
      } else {
        return false;
      }
    }

    /**
     * this.getSkillName - Getter
     *
     * @returns {string}  The name of the Skill who own this upgrade
     */
    this.getSkillName = function() {
      return upgradeData.skill;
    };

    /**
     * this.getName - Getter
     *
     * @returns {string}  The name of this upgrade
     */
    this.getName = function() {
      return upgradeData.name;
    };

    // TODO: Function desc
    this.getDevName = function(index) {
      if (index === undefined) {
        return devNames;
      } else {
        return devNames[index];
      }
    };

    /**
     * this.getReplaces - Getter
     *
     * @returns {string}  The name of the upgrade that should be replaced by this upgrade
     */
    this.getReplaces = function() {
      return upgradeData.replaces;
    };

    /**
     * this.getDescription - Getter
     *
     * @returns {string}  The description of this upgrade
     */
    this.getDescription = function() {
      return upgradeData.description;
    };

    /**
     * this.getIcon - Getter
     *
     * @returns {string}  The URL of the icon of this upgrade
     */
    this.getIcon = function() {
      return upgradeData.icon;
    };

    /**
     * this.getCost - Getter
     *
     * @returns {number}  The cost per stage of this upgrade
     */
    this.getCost = function() {
      return upgradeData.cost;
    };

    /**
     * this.getSteps - Getter
     *
     * @param {number} step - Optional, return specified step instead of all step if specified
     * @returns {array}  Step = upgrade stage, each step contains multiples Effects
     */
    this.getSteps = function(step) {
      if (step !== undefined) {
        return steps[step] || [];
      } else {
        return steps;
      }
    };

    /**
     * this.getUsedBy - Getter
     *
     * @returns {string}  Who should use this upgrade, can be "all", "noExpansion", or an expansion name
     */
    this.getUsedBy = function() {
      return upgradeData.usedby;
    };

    /**
     * this.getStageCount - Getter
     *
     * @returns {number}  How much "steps" this upgrade has
     */
    this.getStageCount = function() {
      return steps.length;
    };

    init(upgradeAPIData);
  };

  Upgrade.list = [];
  Upgrade.USED_BY_ALL = "all";
  Upgrade.USED_BY_NO_EXPANSION = "noExpansion";
  Upgrade.USED_BY_NONE = "none";
  Upgrade.MAX_STEP_AVAILABLE = 4;
