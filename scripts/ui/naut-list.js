var UINautList = new function(){
  var self = this;

  /**
   * Display naut's art, skills and description. Remove it if naut is set to false (except if selectedNaut is set)
   * @param {object} naut - Data for an Awesomenauts or false
   */
  this.displayNautInformation = function(naut) {
    if(naut == false) {
      // Do not clear informations if a naut is selected
      UIManager.elements.nautSplashArt.html("");
      UIManager.elements.nautDescription.html("");
      UIManager.elements.skillDescription.html("");
      return;
    }

    // Description
    UIManager.elements.nautDescription
      .html("")
      .append($("<div>").text(naut.role + " - " + naut.attacktype + " - " + naut.mobility)
      .append($("<div>").addClass("naut-story").html(nl2br($("<p>"+naut.description+"</p>").text())))
    );

    // Art
    UIManager.elements.nautSplashArt
      .html("")
      .append(
        $("<div>")
          .addClass("naut-name")
          .text(naut.name)
      )
      .append(
        $("<img>")
          .addClass("naut-image")
          .attr("src", naut.image)
      )

      // Skills
      UIManager.elements.skillDescription.html("<div>Skills</div>");
      if(naut.skills) {
        for(var i = 0; i < naut.skills.length; ++i) {
          var skill = naut.skills[i];
          UIManager.elements.skillDescription
            .append($("<img>").attr("src", skill.icon))
            .append($("<span>").text(skill.description))
            .append($("<hr>"))
        }
      }
  };

  /**
   * Add all the nauts in #nauts-list
   * @param {array} nauts - The list of nauts to add
   */
  this.addNautsToUi = function(nauts) {
    for(var i = 0; i < nauts.length; ++i) {
      var naut = nauts[i];

      (function(naut){
        var nautImage = $("<img>");
        nautImage
          .attr("src", naut.icon)
          .addClass("naut-icon")
          .attr("id", "naut-icon-" + getValidElementId(naut.name));


        // TODO: Check if it's required to add onmouseleave and to clear displayNautInfo
        EventManager.addEvent(nautImage, "mouseenter", function(){
          self.displayNautInformation(naut);
        });

        EventManager.addEvent(nautImage, "click", function(){
          // Remove all other selections and select this image
          $(".naut-icon").removeClass("selected");
          $(this).addClass("selected");

          UIManager.elements.nautList.removeClass("naut-list-center");
          UIManager.elements.nautList.addClass("naut-list-right");

          UIShop.displayShop(naut);
          UINautList.onMouseLeaveNautList();
          NautsBuilder.onNautSelected(naut);
        });

        UIManager.elements.nautList.append(nautImage);
      })(naut);
    }

    // Add the random icon
    var randomIcon = $("<img>");
    randomIcon.attr("src", CONFIG.path.images + "/random-naut.png").addClass("naut-icon");

    EventManager.addEvent(randomIcon, "click", function(){
      var randomNaut = Math.round(Math.random() * $("#naut-list .naut-icon").length);
      $("#naut-list .naut-icon").each(function(i, item) {
        if(i == randomNaut) {
          $(this).click();
          NautsBuilder.getRandomBuild();

          return false;
        }
      });

    });

    UIManager.elements.nautList.append(randomIcon);
  };

  /**
   * Hide the shop and infobox when the mouse enters the naut list
   */
  this.onMouseEnterNautList = function() {
    var offsetLeft = "-55%";

    UIManager.elements.shop.css("left", offsetLeft);
    UIManager.elements.buildOrder.css("left", offsetLeft);

    UIManager.elements.nautSplashArt.fadeIn();
    UIManager.elements.nautDescription.fadeIn();
    UIManager.elements.skillDescription.fadeIn();
    UIManager.elements.about.fadeOut();

    $(".build-info").fadeOut();
  };

  /**
   * Display the shop and infobox when the mouse leaves the naut list
   */
  this.onMouseLeaveNautList = function() {
    if(!UIManager.elements.shop.is(":visible")) {
      return;
    }

    UIManager.elements.shop.css("left", 0 + "px");
    UIManager.elements.buildOrder.css("left", 0 + "px");

    UIManager.elements.nautSplashArt.fadeOut();
    UIManager.elements.nautDescription.fadeOut();
    UIManager.elements.skillDescription.fadeOut();
    UIManager.elements.about.fadeIn();

    $(".build-info").fadeIn();
  };
}
