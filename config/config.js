// If you want to change the path, you will also have to change:
// - index.php, src to main.js and config.js
// - All the css: urls to images
var CONFIG = new function(){
  this.scriptList = [
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
