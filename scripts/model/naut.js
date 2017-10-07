/**
 * var Naut - The structure of an Awesomenauts, contains a list of skills among other informations provided by the API
 * Instances of this class are stored in the naut-controller
 * @param {JSONObject} nautAPIData - The data taken from the API for a single Naut
 */
var Naut = function(nautAPIData) {
  var skills = [];
  var nautData = false; // We keep the API format to reduce the quantity of useless code

  /**
   * var init - "Constructor" for this "class"
   *
   * @param  {JSONObject} nautAPIData See class description
   */
   var init = function(nautAPIData){
     if(!nautAPIData) {
       console.error("naut.js: constructor can't be called without args");
       return false;
     }
     else {
       nautData = nautAPIData;
     }
   };

  /**
   * this.getName - Getter
   *
   * @returns {string} The name for this Awesomenaut
   */
  this.getName = function(){
    return nautData.name;
  };

  /**
   * this.getDescription - Getter
   *
   * @returns {string} The description for this Awesomenaut
   */
  this.getDescription = function(){
    return nautData.description;
  };

  /**
   * this.getIcon - Getter
   *
   * @returns {string} The URL of the icon for this Awesomenaut
   */
  this.getIcon = function(){
    return nautData.icon;
  };

  this.getDevName = function(){
    return nautData.devname || "";
  };

  /**
   * this.getAttackType - Getter
   *
   * @returns {string} The attackType for this Awesomenaut
   */
  this.getAttackType = function(){
    return nautData.attacktype; // No camelcase isn't a mistake :/
  };

  /**
   * this.getRole - Getter
   *
   * @returns {string} The role for this Awesomenaut
   */
  this.getRole = function(){
    return nautData.role;
  };

  /**
   * this.getMobility - Getter
   *
   * @returns {string} The mobility for this Awesomenaut
   */
  this.getMobility = function(){
    return nautData.mobility;
  };

  /**
   * this.getWikiURL - Getter
   *
   * @returns {string} The wiki URL for this Awesomenaut
   */
  this.getWikiURL = function(){
    return nautData.wikiurl;
  };

  /**
   * this.getSplashArt - Getter
   *
   * @returns {string} The URL of the splash art for this Awesomenaut
   */
  this.getSplashArt = function(){
    return nautData.image;
  };

  /**
   * this.getExpansion - Getter
   *
   * @returns {string} The expansion for this Awesomenaut. Can be "none", "starstorm", "overdrive"
   */
  this.getExpansion = function(){
    return nautData.expansion;
  };

  /**
   * this.isBeta - Getter
   *
   * @returns {boolean} True if the Awesomenaut is only accessible in the beta
   */
  this.isBeta = function(){
    return nautData.beta === 1;
  };

  /**
   * this.getSkills - Getter
   *
   * @param {number} row - If specified, return only the skill for the row
   * @returns {array} The array containing the 4 skills of the awesomenauts
   */
  this.getSkills = function(row){
    if(row !== undefined) {
      return skills[row];
    }
    else {
      return skills;
    }
  };

  /**
   * this.addSkill - Add a skill to this naut
   *
   * @returns {Skill} skill The skill to add
   */
  this.addSkill = function(skill){
    skills.push(skill);
  };

  init(nautAPIData);
};

// List of all the nauts, loaded by the controller
Naut.list = [];
Naut.EXPANSION_NONE = "none"; // We don't need the other because we never check for a specific expansion

Naut.getByName = function(nautName){
  // We sadly have to hard-code this one to keep compatibility with the old Nautsbuilder links
  // New nauts won't need this since the old Nautsbuilder isn't updated anymore
  if(nautName == "Skolldir") {
    nautName = "Sklldir";
  }

  nautName = getCleanString(nautName).toLowerCase();
  for(var i = 0; i < Naut.list.length; ++i) {
    if(getCleanString(Naut.list[i].getName()).toLowerCase() == nautName) {
      return Naut.list[i];
    }
  }
  return false;
};
