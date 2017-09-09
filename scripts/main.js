/**
<<<<<<< HEAD
 * Include all scripts required in the app
 */
var Main = new function() {
  var scriptListLength;
  var loadedScripts;
  var self = this;

  /**
   * Load scripts
   */
  var init = function(){
    scriptListLength = CONFIG.scriptList.length;
    loadedScripts = 0;
=======
 * Load all the scripts and all the styles and instanciate everything
 */
var Main = new function(){
  var scriptListLength = CONFIG.scriptList.length;
  var self = this;

  this.tooltip = false;

  /**
   * Load scripts and styles
   */
  this.init = function(){
    includeStyles();
>>>>>>> master
    includeScripts();
  };

  /**
<<<<<<< HEAD
   * Init the main controller
   */
  var onScriptsLoaded = function(){
    if(++loadedScripts == scriptListLength) {
      InfoBoxView.init();
      NautController.init();
      BuildController.init();
      ShopView.init();
      MessageBox.init();
      MessageBoxView.init();
    }
=======
   * Instanciate and init classes
   */
  var onScriptsLoaded = function(){
    this.tooltip = new Tooltip("#tooltip");
    UIManager.init();
    NautsBuilder.init();
    addEventListner();
>>>>>>> master
  };

  /**
   * Load all the scripts specified in the configuration file, call onScriptsLoaded when all loaded
   */
  var includeScripts = function(){
<<<<<<< HEAD
    for(var i = 0; i < CONFIG.scriptList.length; ++i) {
      self.getScript(CONFIG.path.scripts + CONFIG.scriptList[i], onScriptsLoaded);
=======
    var loadedScripts = 0;
    for(var i = 0; i < CONFIG.scriptList.length; ++i) {
      self.getScript(CONFIG.path.scripts + CONFIG.scriptList[i], function(){
        if(++loadedScripts == scriptListLength) {
          onScriptsLoaded();
        }
      });
    }
  };

  /**
   * Load all the styles specified in the configuration file
   * TODO: Maybe move this back to index.php to reduce loading time?
   */
  var includeStyles = function() {
    var headElement = document.getElementsByTagName('head')[0];
    for(var i = 0; i < CONFIG.styleList.length; ++i) {
      var linkElem = document.createElement('link');
      headElement.appendChild(linkElem);
      linkElem.rel = 'stylesheet';
      linkElem.type = 'text/css';
      linkElem.href = CONFIG.path.styles + CONFIG.styleList[i];
>>>>>>> master
    }
  };

  /**
<<<<<<< HEAD
=======
   * Add all global events
   */
  var addEventListner = function(){
    EventManager.addEvent(document, "mousemove", function(e){
      tooltip.onMouseMove(e);
    });

    EventManager.addEvent(document, "keydown", function(e){
      if(e.keyCode == 115) {
        NautsBuilder.skillCheck();
      }
    });
  };

  /**
>>>>>>> master
   * Load the specified javascript script
   * Source: https://stackoverflow.com/questions/16839698/jquery-getscript-alternative-in-native-javascript
   * @param {string} source - The URL to the script
   * @param {function} callback - The function called when the file is sucessfuly loaded
   */
   this.getScript = function(source, callback) {
     var script = document.createElement('script');
     var prior = document.getElementsByTagName('script')[0];
     script.async = 1;

     script.onload = script.onreadystatechange = function( _, isAbort ) {
       if(isAbort || !script.readyState || /loaded|complete/.test(script.readyState) ) {
         script.onload = script.onreadystatechange = null;
         script = undefined;

         if(!isAbort) { if(callback) callback(); }
       }
     };

     script.src = source;
     prior.parentNode.insertBefore(script, prior);
<<<<<<< HEAD
   };

   init();
};
=======
   }
};

Main.init();
>>>>>>> master
