var MainView = new function() {
  this.onLoaded = function() {
    $("#loading img, #loading span").hide();
    $("#loading").fadeOut(400);
    $(document).on("mousemove", function(e){
      Tooltip.onMouseMove(e);
    });
    $("#settings-container").click(function(){MessageBoxView.displaySettings();});
  };
};
