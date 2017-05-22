// Config
// TODO: Create a config file
var BASE_PATH = "/standalone/nautsbuilder/";
var API_URL = "/resources/logic/php/ajax/awesomenauts.php";

var tooltip = new Tooltip("#tooltip");
UIManager.init();
NautsBuilder.init();

EventManager.addEvent(document, "mousemove", function(e){
  tooltip.onMouseMove(e);
});

EventManager.addEvent(document, "keydown", function(e){
  if(e.keyCode == 115) {
    NautsBuilder.skillCheck();
  }
});
