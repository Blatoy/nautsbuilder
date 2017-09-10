  /**
 * var Upgrade - Describes an upgrade, see the spreadsheet for more details
 * Instances of this class are stored in a Skill
 * @param  {JSONObject} upgradeAPIData The data taken from the API for a single Upgrade
 */
var Upgrade = function(upgradeAPIData) {
  var self = this;
  var upgradeData = false;
  var steps = [];
  var devNames = [];

  /**
   * var init - "Constructor" for this "class"
   * Stores naut data in the class
   * @param  {JSONObject} upgradeAPIData See class description
   */
  var init = function(upgradeAPIData){
    if(!upgradeAPIData) {
      console.error("upgrade.js: constructor can't be called without args");
      return false;
    }
    else {
      upgradeData = upgradeAPIData;
      // Get upgrade stage effects and dev names
      for(var i = 0; i < Upgrade.MAX_STEP_AVAILABLE; ++i) {
        if(upgradeData["step" + (i + 1)] !== undefined) {
          var rawEffects = upgradeData["step" + (i + 1)].split(Effect.EFFECT_SEPARATOR);
          var effectScaling = [];
          if(upgradeData.effectscaling) {
            effectScaling = upgradeData.effectscaling.split(Effect.EFFECT_SEPARATOR) || [];
          }
          var effects = [];

          for(var j = 0; j < rawEffects.length; ++j) {
            if(rawEffects[j].replace(/\s/g, "") !== "") {
              effects.push(new Effect(rawEffects[j], effectScaling[j].replace(" ", "")));
            }
          }
          steps.push(effects);
        }

        if(upgradeData["devname" + (i + 1)] !== undefined) {
          devNames.push(upgradeData["devname" + (i + 1)]);
        }
      }
    }
  };

  this.toString = function() {
    var txt = "<b>" + htmlToText(this.getName()) + "</b><br><br>";
    txt += "<img style='vertical-align: middle;' src='" + CONFIG.path.images + "solar-icon.png'/>" + htmlToText(this.getCost());
    txt += "";
    for(var i = 0; i < this.getSteps().length; ++i) {
      txt += "<br><br>Stage " + (i + 1) + "<span class='tooltip-upgrades'>";
      for(var j = 0; j < this.getSteps(i).length; ++j) {
        txt += "<br>- " + this.getSteps(i)[j].toString();
      }
      txt += "</span>";
    }
    txt += "<br><br>";
    txt += "<span class='small-text'>" + htmlToText(this.getDescription()) + "</span>";

    // TODO: Press ctrl + click to copy dev name
    if(Setting.get("displayDevNames")) {
      var devNames = this.getDevName();
      if(devNames.length != 0) {
        txt += "<hr><span class='small-text'><b>Dev name</b>";
        for(var i = 0; i < devNames.length; ++i) {
          txt += "<br>Stage " + (i + 1) + ": " + htmlToText(devNames[i]);
        }

        txt += "</span>";
      }
      else {
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
  this.getCharacter = function(){
    return upgradeData.character;
  };

  /**
   * this.getSkillName - Getter
   *
   * @returns {string}  The name of the Skill who own this upgrade
   */
  this.getSkillName = function(){
    return upgradeData.skill;
  };

  /**
   * this.getName - Getter
   *
   * @returns {string}  The name of this upgrade
   */
  this.getName = function(){
    return upgradeData.name;
  };

  // TODO: Function desc
  this.getDevName = function(index){
    if(index === undefined) {
      return devNames;
    }
    else {
      return devNames[index];
    }
  };

  /**
   * this.getReplaces - Getter
   *
   * @returns {string}  The name of the upgrade that should be replaced by this upgrade
   */
  this.getReplaces = function(){
    return upgradeData.replaces;
  };

  /**
   * this.getDescription - Getter
   *
   * @returns {string}  The description of this upgrade
   */
  this.getDescription = function(){
    return upgradeData.description;
  };

  /**
   * this.getIcon - Getter
   *
   * @returns {string}  The URL of the icon of this upgrade
   */
  this.getIcon = function(){
    return upgradeData.icon;
  };

  /**
   * this.getCost - Getter
   *
   * @returns {number}  The cost per stage of this upgrade
   */
  this.getCost = function(){
    return upgradeData.cost;
  };

  /**
   * this.getSteps - Getter
   *
   * @param {number} step - Optional, return specified step instead of all step if specified
   * @returns {array}  Step = upgrade stage, each step contains multiples Effects
   */
  this.getSteps = function(step){
    if(step !== undefined) {
      return steps[step] || [];
    }
    else {
      return steps;
    }
  };

  /**
   * this.getUsedBy - Getter
   *
   * @returns {string}  Who should use this upgrade, can be "all", "noExpansion", or an expansion name
   */
  this.getUsedBy = function(){
    return upgradeData.usedby;
  };

  /**
   * this.getStageCount - Getter
   *
   * @returns {number}  How much "steps" this upgrade has
   */
  this.getStageCount = function(){
    return steps.length;
  };

  init(upgradeAPIData);
};

Upgrade.list = [];
Upgrade.USED_BY_ALL = "all";
Upgrade.USED_BY_NO_EXPANSION = "noExpansion";
Upgrade.USED_BY_NONE = "none";
Upgrade.MAX_STEP_AVAILABLE = 4;
