let InfoBoxView = new function() {
  let infoBoxes;
  let self = this;

  this.init = function() {
    infoBoxes = {
      about: new InfoBox("Assets taken from <a href='http://awesomenauts.com'>Awesomenauts</a>, data gathered by <button onclick='MessageBoxView.displayContributors()'>the community.</button><br>" +
        "Nautsbuilder V2 made with love by <a href='http://steamcommunity.com/id/blatoy/'>Blatoy</a>.<br>" +
        "If you want to support this tool consider making a small <a href='/donate'>donation</a> to help me pay the server!<hr>" +
        "<button onclick='MessageBoxView.displayErrorReport()'>Report errors</button> - <a href='https://github.com/Blatoy/nautsbuilder/'>Github</a>" +
        " - <a href='https://www.awesomenauts.com/forum/viewtopic.php?f=14&t=50115&sid=dbaf3f08554b809a95e0415f31dc3159'>Forum</a> - " +
        "<a href='https://discord.gg/GsE29w7'>Discord</a><div id='cacheDisabledInfo'><hr><b style='color: red;'>Cache auto-update disabled!</b></div>" +
        '<div id="settings-container"><img src="' + CONFIG.path.images + 'gear.png"/></div>', "about"),
      skills: new InfoBox("", "skill-description"),
      lore: new InfoBox("", "naut-description"),
      buildInfo1: new InfoBox("displayBuildSummary() error. Please retry.", "build-info-1"),
      buildInfo2: new InfoBox("displayBuildSummary() error. Please retry.", "build-info-2"),
      buildInfo3: new InfoBox("displayBuildSummary() error. Please retry.", "build-info-3"),
      buildInfo4: new InfoBox("displayBuildSummary() error. Please retry.", "build-info-4"),
      buildSummary: new InfoBox("displayBuildSummary() error. Please retry.", "build-summary")
    };
  };

  // TODO: Add desc
  this.displayLore = function(naut) {
    infoBoxes.lore.setContent("<div>" + htmlToText(naut.getRole()) + " - " + htmlToText(naut.getAttackType()) + " - " + htmlToText(naut.getMobility()) + "</div>" +
      "<span class='small-text'>" + htmlToText(naut.getDescription()) + "</span>");
    infoBoxes.lore.setVisibility(true, true);
    infoBoxes.about.setVisibility(false, true);
  };

  // TODO: Add desc
  this.displaySkills = function(naut) {
    let content = "";
    let element = $("<div>");
    element.append("<div>Skills</div>");

    for (let i = 0; i < naut.getSkills().length; ++i) {
      let skill = naut.getSkills(i);
      let skillImage = $("<img/>").attr("src", skill.getIcon());
      element.append(skillImage);
      element.append("<span>" + htmlToText(skill.getDescription()) + "</span><hr>")
      Tooltip.createDefault(skillImage, skill.toString());
    }

    infoBoxes.skills.setContent(element);
    infoBoxes.skills.setVisibility(true, true);
  };

  // TODO: Add desc
  this.displayBuildSummary = function() {
    for (let i = 1; i < 5; ++i) {
      infoBoxes["buildInfo" + i].setVisibility(true, true);
    }
    infoBoxes.buildSummary.setVisibility(true, true);
  };

  // TODO: Add desc
  this.hideBuildSummary = function() {
    for (let i = 1; i < 5; ++i) {
      infoBoxes["buildInfo" + i].setVisibility(false, true);
    }
    infoBoxes.buildSummary.setVisibility(false, true);
  };

  // TODO: Add desc
  this.setBuildSummaryContent = function() {
    for (let i = 0; i < 4; ++i) {
      infoBoxes["buildInfo" + (i + 1)].setContent("");
      let effects = Build.current.getRowEffects(i);
      let content = "";

      for (let k in effects) {
        if (!Setting.get("debugDisplayScaleType")) {
          if (effects[k].value != 0) {
            content += Effect.toString({
              unit: effects[k].unit,
              value: effects[k].value,
              key: k
            }) + "<br>";
          }
        } else {
          if (effects[k].value != 0) {
            content += Effect.toString({
              unit: effects[k].unit,
              value: effects[k].value,
              key: k
            }) + " - " + htmlToText(effects[k].scaleType) + "<br>";
          }
        }
      }

      content += "<span class='build-summary-cost'>" + Build.current.getRowPrice(i) + "<img src='" + CONFIG.path.images + "solar-icon.png'></span>"
      infoBoxes["buildInfo" + (i + 1)].setContent(content);
    }

    infoBoxes.buildSummary.setContent(
      "<label>Total cost:</label> <span class='solar-price'>" + Build.current.getPrice() + "</span> " +
      "<img src='" + CONFIG.path.images + "solar-icon.png" + "'></img>" +
      "<hr><label>Forum link:</label><input type='text' value='[build]" + Build.current.toString(true) + "[/build]'>" +
      "<hr><label>Team level: <span style='color: white; margin-right: 10px;' id='team-level-label'>" + Setting.get("teamLevel") + "</span></label><input oninput='InfoBoxView.setTeamLevelDisplay(this.value)' onmouseup='Setting.setTeamLevel(this.value)' id='team-level' type='range' min='1' max='20' value='" + Setting.get("teamLevel") + "' step='1'>" +
      "<hr><button onclick='MessageBoxView.displayExportImage()'>Export as image</button> - <button onclick='BuildController.setRandomBuild()'>Random build</button>"
    );
  };

  // TODO: Add desc
  this.setTeamLevelDisplay = function(level) {
    $("#team-level-label").text(level);
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

    if (localStorage.getItem("cacheVersion") == "-1") {
      $("#cacheDisabledInfo").show();
    } else {
      $("#cacheDisabledInfo").hide();
    }
  };

  // TODO: Add desc
  this.displayRandomNaut = function() {
    this.hideLore();
    this.hideSkills();
    this.displayAbout();
  };

  this.onLoaded = function() {
    infoBoxes.about.getElement().fadeIn(200);
    self.displayAbout();
  };
  this.setAboutVisibility = function(visible) {
    if (visible) {
      self.displayAbout();
    } else {
      infoBoxes.about.setVisibility(false, true);
    }
  };
};