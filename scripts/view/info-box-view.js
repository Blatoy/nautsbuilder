var InfoBoxView = new function() {
  var infoBoxes;

  this.init = function() {
    infoBoxes = {
      about: new InfoBox("Assets taken from <a href='http://awesomenauts.com'>Awesomenauts</a>, data gathered by <a onclick='MessageBoxView.displayContributors()' href='#'>the community.</a><br>" +
        "Nautsbuilder V2 made by <a href='steamcommunity.com/id/blatoy/'>Blatoy</a>.<br>" +
        "If you want to support this tool consider making a small <a href='/donation'>donation</a> to help me pay the server!<hr>" +
        "<a href='#' onclick='MessageBoxView.displayErrorReport()'>Report errors</a> - <a href='https://github.com/Blatoy/nautsbuilder/'>Github</a>" +
        " - <a href='https://www.awesomenauts.com/forum/viewtopic.php?f=14&t=50115&sid=dbaf3f08554b809a95e0415f31dc3159'>Forum</a> - " +
        "<a href='https://discord.gg/GsE29w7'>Discord</a>", "about"),
      skills: new InfoBox("", "skill-description"),
      lore: new InfoBox("", "naut-description")
    };
  };

  // TODO: Add desc
  this.displayLore = function(naut){
    infoBoxes.lore.setContent("<div>" + naut.getRole() + " - " + naut.getAttackType() + " - " + naut.getMobility() + "</div>" +
                              "<span class='small-text'>" + htmlToText(naut.getDescription()) + "</span>");
    infoBoxes.lore.setVisibility(true, true);
    infoBoxes.about.setVisibility(false, true);
  };

  // TODO: Add desc
  this.displaySkills = function(naut){
    var content = "";
    var element = $("<div>");
    element.append("<div>Skills</div>");

    for(var i = 0; i < naut.getSkills().length; ++i) {
      var skill = naut.getSkills(i);
      var skillImage = $("<img/>").attr("src", skill.getIcon());
      element.append(skillImage);
      element.append("<span>" + skill.getDescription() + "</span><hr>")
      Tooltip.createDefault(skillImage, skill.toString());
    }

    infoBoxes.skills.setContent(element);
    infoBoxes.skills.setVisibility(true, true);
  };

  // TODO: Add desc
  this.hideSkills = function() {
    infoBoxes.skills.setVisibility(false, true);
  };

  // TODO: Add desc
  this.hideLore = function() {
    infoBoxes.lore.setVisibility(false, true);
  };

  // TODO: Add desc
  this.displayAbout = function() {
    infoBoxes.about.setVisibility(true, true);
  };

  // TODO: Add desc
  this.displayRandomNaut = function(){
    this.hideLore();
    this.hideSkills();
    this.displayAbout();
  };

  // TODO: Add desc
  this.displayBuildSummary = function() {

  };

  // TODO: Add desc
  this.displaySkillSummary = function() {

  };

  this.onLoaded = function() {
    infoBoxes.about.getElement().fadeIn(200);
    infoBoxes.about.setVisibility(true, true);
  };
  this.setAboutVisibility = function(visible){
    infoBoxes.about.setVisibility(visible, true);
  };
};
