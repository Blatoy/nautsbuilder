var MainView = new function() {
  var self = this;
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
      switch(e.keyCode) {
        case 115: // F4
          MessageBoxView.displayDebug();
          break;
      }
    });

    $("#settings-container").click(function(){MessageBoxView.displaySettings();});
  };
};
