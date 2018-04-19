var MainView = new function() {
  var self = this;
  var keyReleased = true;

  this.mousePos = {x: 0, y: 0};

  this.onLoaded = function() {
    $("#loading").fadeOut(400);
    $("#loading img, #loading span").fadeOut(350);

    $(document).on("mousemove", function(e){
      self.mousePos.x = e.clientX || e.pageX;
      self.mousePos.y = e.clientY || e.pageY;

      Tooltip.onMouseMove(e);
    });

    $(document).on("keydown", function(e){
      if(keyReleased) {
        keyReleased = false;
        switch(e.keyCode) {
          case 115: // F4
            MessageBoxView.displayDebug();
            break;
          case 17: // ctrl
            Tooltip.togglePositionUpdateActivation();
            break;
        }
      }
    });

    $(window).on("blur", function(e){
      // Force key release when leaving the page
      keyReleased = true;
      if(!Tooltip.positionUpdateEnabled) {
        // Quick fix preventing tooltip display
        Tooltip.togglePositionUpdateActivation();
      }
    });

    $(document).on("keyup", function(e){
      if(keyReleased == false) {
        keyReleased = true;
        switch(e.keyCode) {
          case 17: // ctrl
            Tooltip.togglePositionUpdateActivation();
            break;
        }
      }
    });

    $("#settings-container").click(function(){MessageBoxView.displaySettings();});
  };
};
