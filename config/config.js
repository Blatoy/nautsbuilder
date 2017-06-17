// If you want to change the path, you will also have to change:
// - index.php, src to main.js and config.js
// - All the css: urls to images
var CONFIG = new function(){
  this.scriptList = [
<<<<<<< HEAD
    "libs/jquery.min.js",
    "libs/event-manager.js",
    "libs/utils.js",
    "controller/naut-controller.js",
    "controller/build-controller.js",
    "model/build.js",
    "model/effect.js",
    "model/info-box.js",
    "model/naut.js",
    "model/skill.js",
    "model/upgrade.js",
    "view/info-box-view.js",
    "view/naut-view.js",
    "view/shop-view.js"
=======
    "jquery.min.js",
    "event-manager.js",
    "nautsbuilder.js",
    "skill-parser.js",
    "tooltip.js",
    "ui/manager.js",
    "ui/shop.js",
    "ui/summary.js",
    "ui/upgrade.js",
    "ui/naut-list.js",
    "utils.js"
>>>>>>> 4664d57bf5a6602641913854e7c0a6571af492a8
  ];

  this.styleList = [
    "main.css",
    "naut-info.css",
    "shop.css",
    "tooltip.css",
    "upgrade.css"
  ];

  this.apiURL = "https://orikaru.net/resources/logic/php/ajax/awesomenauts.php";

  var path = {};
  path["base"] = "/nautsbuilder/";
  path["scripts"] = path["base"] + "scripts/";
  path["images"] = path["base"] + "images/";
  path["styles"] = path["base"] + "styles/";

  this.path = path;
};
