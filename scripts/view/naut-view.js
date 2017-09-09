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

  // TODO: Function desc
  this.setSelectedNaut = function(element) {
    $(".naut-icon").removeClass("selected");
    element.addClass("selected");
  };

  // TODO: Function desc
  this.getIconElementForNaut = function(naut) {
    var element = false;
    $(".naut-icon").each(function(i) {
      if(this.src == naut.getIcon()) {
        return element = $(this); // wtf there's probably a meaning to that. TODO: Check why it's done this way
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
    $("#naut-art").show();
    $("#naut-art").attr("src", CONFIG.path.images + "naut-random.png");
    $("#naut-name").text("Random");
  };

  // TODO: Function desc
  this.displayArt = function(naut) {
    $("#naut-art").show();
    $(document.body).css("background-image", "url(/nautsbuilder/images/bg-light.jpg)");
    $("#naut-art").attr("src", naut.getSplashArt());
  };

  // TODO: Function desc
  this.displayName = function(naut){
    $("#naut-name").show();
    var devText = Setting.get("displayDevNames") ? "<br><span class='small-text'>" + naut.getDevName() + "</span>" : "";
    $("#naut-name").html(htmlToText(naut.getName()) + devText);
  };

  // TODO: Function desc
  this.hideName = function() {
    $("#naut-name").hide();
  };

  // TODO: Function desc
  this.hideArt = function() {
    $(document.body).css("background-image", "url(/nautsbuilder/images/bg.jpg)");
    $("#naut-art").hide();
  };
};
