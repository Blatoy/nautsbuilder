// TODO: Desc
// Not exactly the same as info-boxes because we can only have one message box displayed at the same time
var MessageBoxView = new function() {
  var messageBoxes;

  // TODO: Desc
  this.init = function() {
    messageBoxes = {
      settings: {
        title: "Settings",
        content:
        "<label>Team level: <span id='team-level-label'>1</span></label><input oninput='Setting.setTeamLevel(this.value)' id='team-level' type='range' min='1' max='20' value='1' step='1'><br>" +
        Setting.getSettingCheckbox("*Display dev names", "displayDevNames") + "<br>" +
        Setting.getSettingCheckbox("*Disable local caching", "disableCache") + "<br>" +
        "<span class='default-font'><hr>*You must <a href=''>refresh the page</a> to apply these settings</span>"},
      contributors: {
        title: "Contributors",
        content: "<div class='default-font'>Nautsbuilder V2 was inspired by the original Nautsbuilder made by <b>Leimi</b> and maintained by <b>r0estir0bbe</b>.<br>" +
          "Thanks to everyone who built the original data spreadsheet!<br>" +
          "Thanks to everyone who gave me feedback, specialy on the <b>UMA Discord</b>!<br>" +
          "Thanks to everyone listed below for keeping the current spreadsheet up to date!<hr><b>List of approved contributors:</b><br><div id='contributors'></div><span class='small-text'>Want to help / your name is missing? Join discord and ask @Blatoy about Nautsbuilder!</span></div>"
      }
    };
  };

  this.displayContributors = function() {
    MessageBox.show(messageBoxes.contributors.title, messageBoxes.contributors.content);
    $("#contributors").html("");
    for(var i = 0; i < contributors.length; ++i) {
      $("#contributors").append("- " + contributors[i] + "<br>")
    }
  };

  this.displaySettings = function(){
    MessageBox.show(messageBoxes.settings.title, messageBoxes.settings.content);
    $("#team-level-label").text(Setting.get("teamLevel"));
    $("#team-level").val(Setting.get("teamLevel"));
  };
};
