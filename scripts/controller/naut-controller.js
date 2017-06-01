/**
* var NautController - Handle everything related to nauts
* Upgrades are moved into skills once loaded and skills are moved to nauts
*/
var NautController = new function(){
  var self = this;
  var apiToLoadCount = 3; // The number of API to load, used to track when everything is loaded.

  /**
   * this.init - "Constructor" for this "class" should be called when all the scripts are ready to be used
   */
  this.init = function(){
    loadDataFromAPIs();
  };

  /**
   * var loadDataFromAPIs - Query APIs, instanciate corresponding classes
   * Call onAPILoaded everytime an API is loaded
   */
  var loadDataFromAPIs = function(){
    queryAPI("nautsbuilder-get-characters", function(data, textStatus){
      if(data) {
        for(var i = 0; i < data.length; ++i) {
          Naut.list.push(new Naut(data[i]));
        }
        onAPILoaded();
      }
      else {
        // TODO: Error handling
      }
    });
    queryAPI("nautsbuilder-get-skills", function(data, textStatus){
      if(data) {
        for(var i = 0; i < data.length; ++i) {
          Skill.list.push(new Skill(data[i]));
        }
        onAPILoaded();
      }
      else {
        // TODO: Error handling
      }
    });
    queryAPI("nautsbuilder-get-upgrades", function(data, textStatus){
      if(data) {
        for(var i = 0; i < data.length; ++i) {
          Upgrade.list.push(new Upgrade(data[i]));
        }
        onAPILoaded();
      }
      else {
        // TODO: Error handling
      }
    });
  };

  /**
   * var onAPILoaded - Called each time an API is loaded, when all API are loaded
   * addUpgradesToSkills() and addSkillsToNauts() are called
   */
  var onAPILoaded = function() {
    apiToLoadCount--;
    if(apiToLoadCount === 0) {
      addSkillsToNauts();
      addUpgradesToSkills();
    }
  };

  /**
   * var addUpgradesToSkills - Link upgrades to their skill, also performs check
   * to add global skills
   */
  var addUpgradesToSkills = function() {
    var upgrades = Upgrade.list;
    var nauts = Naut.list;

    for(var i = 0; i < nauts.length; ++i) {
      i = 23;
      var naut = nauts[i];
      var skills = naut.getSkills();

      for(var j = 0; j < skills.length; ++j) {
        var skill = skills[j];
        for(var k = 0; k < upgrades.length; ++k) {
          var upgrade = upgrades[k];

          // In summary: check if the naut own the upgrade
          // we're in the last row and the upgrade is not attached to any naut and
          // if the upgrade is used by everyone (e.g. piggy) or naut's expansion = upgrade's expansion or
          // if the upgrade is for no expansion only and the naut hasn't an expansion
          // or the upgrade has a character attched to it so we don't really care
          if((
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
            if(upgrade.getReplaces() !== undefined) {
              for(var l = 0; l < skill.getUpgrades().length; l++) {
                if(upgrade.getReplaces() == skill.getUpgrades()[l].getName()) {
                  skill.replaceUpgrade(l, upgrade);
                  break;
                }
              }
            }
            else {
              skill.addUpgrade(upgrade);
            }
          }
        }
      }
      break;
    }
  };

  /**
   * var addSkillsToNauts - Link skills to their naut.
   */
  var addSkillsToNauts = function() {
    for(var i = 0; i < Skill.list.length; ++i) {
      var skill = Skill.list[i];
      for(var j = 0; j < Naut.list.length; ++j) {
        var naut = Naut.list[j];

        if(skill.getCharacter() == naut.getName()) {
          naut.addSkill(skill);
          break; // NB: This may be a cause of error
        }
      }
    }
  };


  /**
   * this.onNautClicked - Create a new empty Build
   */
  this.onNautClicked = function() {
  /*  Build.current = new Build();
    Build.setNaut("...");*/
  };

  this.onNautHovered = function() {

  };
};
