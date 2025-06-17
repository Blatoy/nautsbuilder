/**
 * let Skill - Describes a skill, see the spreadsheet for more details
 *
 * Instances of this class are stored in a Naut
 * @param  {JSONObject} upgradeAPIData The data taken from the API for a single Skill
 */
let Skill = function(skillAPIData) {
  let upgrades = [];
  let effects = [];
  let skillData = false;
  /**
   * let init - "Constructor" for this "class"
   *
   * @param  {JSONObject} skillAPIData See class description
   */
  let init = function(skillAPIData) {
    if (!skillAPIData) {
      console.error("skill.js: constructor can't be called without args");
      return false;
    } else {
      skillData = skillAPIData;

      let rawEffects = skillData.effects.split(Effect.EFFECT_SEPARATOR);
      for (let j = 0; j < rawEffects.length; ++j) {
        let effectScaling = [];
        if (skillData.effectscaling) {
          effectScaling = skillData.effectscaling.split(Effect.EFFECT_SEPARATOR) || [];
        }
        if (rawEffects[j].replace(/\s/g, "") !== "") {
          if (!effectScaling[j]) {
            console.error("Missing effect scaling for " + skillData.naut + "'s' " + skillData.name);
          }
          effects.push(new Effect(rawEffects[j], effectScaling[j] ? effectScaling[j].replace(" ", "") : "none"));
        }
      }
    }
  };
  /**
   * this.getCharacter - Getter
   *
   * @returns {string}  The name of the Naut who own this skill
   */
  this.getCharacter = function() {
    return skillData.naut;
  };

  /**
   * this.getName - Getter
   *
   * @returns {string}  The name of this skill
   */
  this.getName = function() {
    return skillData.name;
  };

  // TODO: Desc
  this.getDevName = function() {
    return skillData.devname;
  };

  /**
   * this.getDescription - Getter
   *
   * @returns {string}  The description of this skill
   */
  this.getDescription = function() {
    // TODO: Handle *, ** and remove other html
    return skillData.description;
  };

  /**
   * this.getIcon - Getter
   *
   * @returns {string}  The URL of the icon of this skill
   */
  this.getIcon = function() {
    return skillData.icon;
  };

  /**
   * this.getCost - Getter
   *
   * @returns {number}  The cost per stage of this skill
   */
  this.getCost = function() {
    return skillData.cost;
  };

  // getType is present in the spreadsheet but not used in NB2
  // this.getType = function(){};

  /**
   * this.getEffects - Getter
   *
   * @returns {array}  The array of Effect for this skill
   */
  this.getEffects = function(i) {
    if (i !== undefined) {
      return effects[i];
    } else {
      return effects;
    }
  };

  /**
   * this.getEffects - Getter
   *
   * @param {number} col - Optional, returns the upgrades at the specified col
   * @returns {array}  The array of Upgrades for this skill
   */
  this.getUpgrades = function(col) {
    if (col !== undefined) {
      return upgrades[col];
    } else {
      return upgrades;
    }
  };

  this.toString = function() {
    let row = 0;

    if (Setting.get("debugRCIDisplay") && Build.current.getNaut()) {
      for (let i = 0; i < Build.current.getNaut().getSkills().length; ++i) {
        if (Build.current.getNaut().getSkills(i).getName() == this.getName()) {
          row = i;
        }
      }
    }

    let txt = "<b>" + htmlToText(this.getName()) + "</b>";
    txt += "<br><br>Effects<br><span class='tooltip-upgrades'>";
    for (let i = 0; i < this.getEffects().length; ++i) {
      let effectValueText = this.getEffects(i).toString();
      // Effects that have no text are hidden
      if (effectValueText == "") continue;
      if (!Setting.get("debugRCIDisplay")) {
        txt += "<br>- " + htmlToText(effectValueText);
      } else {
        txt += "<br>¦" + htmlToText(row) + "," + i + "¦ " + htmlToText(effectValueText);
      }
    }
    txt += "</span><br><span class='small-text'>";
    txt += htmlToText(this.getDescription());
    txt += "</span>";

    if (!this.getDevName()) {
      txt += "<hr><span class='small-text'><b>Dev name missing for this skill</b>";
    } else {
      txt += "<hr><span class='small-text'><b>Dev name:</b> " + htmlToText(this.getDevName());
    }

    return txt;
  };

  /**
   * this.addUpgrade - Add an upgrade to this skill
   *
   * @param {Upgrade} upgrade - The upgrade to add
   */
  this.addUpgrade = function(upgrade) {
    upgrades.push(upgrade);
  };

  /**
   * this.addUpgrade - Add an upgrade to this skill
   *
   * @param {number} index - The index of the upgrade to replace
   * @param {Upgrade} upgrade - The replacement upgrade
   */
  this.replaceUpgrade = function(index, upgrade) {
    upgrades[index] = upgrade;
  };

  init(skillAPIData);
};

Skill.list = [];