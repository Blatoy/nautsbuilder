// If you want to change the path, you will also have to change:
// - index.php, src to main.js and config.js
// - All the css: urls to images
var CONFIG = new function() {
  this.scriptList = [
    "libs/jquery.min.js",
    "libs/event-manager.js",
    "libs/utils.js",
    "libs/math.min.js",
    "controller/naut-controller.js",
    "controller/build-controller.js",
    "model/build.js",
    "model/effect.js",
    "model/info-box.js",
    "model/naut.js",
    "model/skill.js",
    "model/upgrade.js",
    "model/tooltip.js",
    "model/message-box.js",
    "model/setting.js",
    "view/main-view.js",
    "view/info-box-view.js",
    "view/naut-view.js",
    "view/shop-view.js",
    "view/message-box-view.js"
  ];

  this.apiURL = "https://orikaru.net/resources/logic/php/ajax/awesomenauts.php";

  this.dpsCalculationRegex = {
    damage: /(.*)damage$/,
    speed: /(.*)attack\sspeed$/,
    multiplier: /(.*)damage\smultiplier$/,
  };


  var path = {};
  path.base = "/standalone/nautsbuilder/";
  path.scripts = path.base + "scripts/";
  path.images = path.base + "images/";

  this.path = path;
};
