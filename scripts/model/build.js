/**
 * var Build - Store informations about the current build
 *
 * @param  {string} URLData Something like: "Nibbs/1001000100200010010001000000/3" This is actually the same format as the old nautsbuilder
 */
var Build = function(URLData){
  var buildOrder = [], upgradesPurchased = [], naut = {};

  /**
   * var init - "Constructor" for this "class"
   *
   * @param  {string} URLData See class description
   */
  var init = function(URLData){

  };

  /**
   * this.parseURLData - Parse data from a URL. Used to import a build.
   *
   * @param  {string} URLData See class description
   * @returns  {object} {buildOrder: [], upgradesPurchased: [[], [], [], []], nautName: "Nibbs"}
   */
  this.parseURLData = function(URLData){

  };

  /**
   * this.getURLData - Generate something like "Nibbs/1001000100200010010001000000/3" format: "nautname/upgradesPurchased/build-order"
   *
   * @returns  {object} {buildOrder: [], upgradesPurchased: [[], [], [], []], nautName: "Nibbs"}
   */
  this.getURLData = function(){};
  init(URLData);
};
