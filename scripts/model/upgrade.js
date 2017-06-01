/**
 * var Upgrade - Describes an upgrade, see the spreadsheet for more details
 * Instances of this class are stored in a Skill
 * @param  {JSONObject} upgradeAPIData The data taken from the API for a single Upgrade
 */
var Upgrade = function(upgradeAPIData) {
  var self = this;
  var upgradeData = false;
  var steps = [];
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
      // Get upgrade stage effects
      for(var i = 0; i < Upgrade.MAX_STEP_AVAILABLE; ++i) {
        if(upgradeData["step" + (i + 1)] === undefined) {
          break;
        }

        var rawEffects = upgradeData["step" + (i + 1)].split(Effect.EFFECT_SEPARATOR);
        var effects = [];

        for(var j = 0; j < rawEffects.length; ++j) {
          if(rawEffects[j].replace(/\s/g, "") !== "") {
            effects.push(new Effect(rawEffects[j]));
          }
        }
        steps.push(effects);
      }
    }
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
   * @returns {array}  Step = upgrade stage, each step contains multiples Effects
   */
  this.getSteps = function(){
    return steps;
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
