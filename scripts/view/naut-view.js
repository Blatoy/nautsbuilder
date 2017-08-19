var NautView = new function() {
  var self = this;
  // TODO: Function desc
  this.displayNautList = function(nautList){
    for(var i = 0; i < nautList.length; ++i) {
      $("#naut-list").append(this.getNautIcon(nautList[i]).hide().fadeIn(200));
    }
  };

  // TODO: Function desc
  this.addRandomIconToNautList = function() {
    $("#naut-list").append(
      $("<img>")
        .addClass("naut-icon")
        .attr("src", "/nautsbuilder/images/icon-random.png")
        .attr("title", "Random character")
        .click(function() {
          NautController.selectRandomNaut();
        })
        .mouseenter(function() {
          NautController.previewRandomNaut();
        })
        .hide().fadeIn(200)
    );
  };

  this.setSelectedNaut = function(element) {
    $(".naut-icon").removeClass("selected");
    element.addClass("selected");
  };

  this.getIconElementForNaut = function(naut) {
    var element = false;
    $(".naut-icon").each(function(i) {
      if(this.src == naut.getIcon()) {
        return element = $(this);
      }
    });
    return element;
  };

  // TODO: Function desc
  this.getNautIcon = function(naut){
    var icon = $("<img>");
      icon.addClass("naut-icon")
        .attr("src", naut.getIcon())
        .attr("title", naut.getName())
        .click(function() {
          self.setSelectedNaut(icon);
          NautController.selectNaut(naut.getName());
        })
        .mouseenter(function() {
          NautController.previewNaut(naut.getName());
        });
    return icon;
  };

  // TODO: Function desc
  this.moveNautSelectionToRight = function() {
    if($("#naut-list").hasClass("naut-list-center")) {
      $("#naut-list").attr("class", "naut-list-right");
    }
  };

  // TODO: Function desc
  this.displayRandomNaut = function(){
    $("#naut-art").stop(true, true);
    $("#naut-art").attr("src", CONFIG.path.images + "naut-random.png");
    $("#naut-name").text("Random");
  };

  // TODO: Function desc
  this.displayArt = function(naut) {
    $("#naut-art").show();
    $("#naut-art").attr("src", naut.getSplashArt());
  };

  // TODO: Function desc
  this.displayName = function(naut){
    $("#naut-name").show();
    $("#naut-name").text(naut.getName());
  };

  // TODO: Function desc
  this.hideName = function() {
    $("#naut-name").hide();
  };

  // TODO: Function desc
  this.hideArt = function() {
    $("#naut-art").hide();
  };
};
