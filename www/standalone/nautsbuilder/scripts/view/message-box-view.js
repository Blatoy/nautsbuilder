// TODO: Desc
// Not exactly the same as info-boxes because we can only have one message box displayed at the same time
let MessageBoxView = new function() {
  let messageBoxes;

  // TODO: Desc
  this.init = function() {
    messageBoxes = {
      settings: {
        title: "Settings",
        content:
          //  "<label>Team level: <span style='color: white;' id='team-level-label'>1</span></label><input oninput='Setting.setTeamLevel(this.value)' id='team-level' type='range' min='1' max='20' value='1' step='1'><hr>" +
          Setting.getSettingCheckbox("Display dev names*", "displayDevNames", "setting-dev-name") + "<hr>" +
          Setting.getSettingCheckbox("Disable local caching*", "disableCache", "setting-local-cache") + "<hr>" +
          "<label>Clear local cache</label><a href='#' onclick='localStorage.clear(); location.reload();'>Clear</a><br>" +
          "<span class='default-font'><hr>*You must <a href=''>refresh the page</a> to apply these settings</span>"
      },
      contributors: {
        title: "Contributors",
        content: "<div class='default-font'>Nautsbuilder V2 was inspired by the original Nautsbuilder made by <b>Leimi</b> and maintained by <b>r0estir0bbe</b>.<br>" +
          "Thanks to everyone who built the original data spreadsheet!<br>" +
          "Thanks to everyone who gave me feedback, especially people from the <b>United Map Makers of Awesomenauts</b>!<br>" +
          "Thanks to everyone listed below for keeping the current spreadsheet up to date!<hr><b>List of approved contributors:</b><br><div id='contributors'></div><span class='small-text'>Want to help / your name is missing? Join discord and ask @Blatoy about Nautsbuilder!</span></div>"
      },
      debug: {
        title: "Debug tools",
        content: "<button onclick='Setting.debugToggleScaleDisplay(); MessageBoxView.displayDebug();'><span id='debug-status-scaling'></span> scaling type display</button>" +
          "<hr><button onclick='Setting.debugToggleDebugNaut(); MessageBoxView.displayDebug();'><span id='debug-status-debug-naut'></span> debug naut display</button>" +
          "<hr><button onclick='Setting.debugToggleCrossRow(); MessageBoxView.displayDebug();'><span id='debug-status-cross-row'></span> raw crossrow display</button>" +
          "<hr><button onclick='Setting.debugToggleMathParser(); MessageBoxView.displayDebug();'><span id='debug-status-math-parser'></span> crossrow math parser</button>" +
          "<hr><button onclick='Setting.debugToggleRCIDisplay(); MessageBoxView.displayDebug();'><span id='debug-status-rci-display'></span> RCI display on upgrade over</button>" +
          "<hr><label>Import custom spreadsheet</label><textarea id='custom-import'></textarea><hr>"
      },
      errorsReport: {
        title: "Report errors",
        content: "<span class='default-font'>If you want to report a wrong value, please select the Awesomenauts and the Upgrade. Otherwise just fill the description.</span><hr>" +
          "<label>Awesomenauts</label><select id='re-naut-list'><option value='0'>Please select a Naut</option></select><hr>" +
          "<label>Upgrade</label><select id='re-upgrade-list' disabled><option value='0'>Please select a Naut</option></select><hr>" +
          "<label>Description</label><textarea placeholder='This field is mandatory' id='re-desc'></textarea><hr>" +
          "<input type='button' id='re-send' value='Submit'>",
        sent: "<span class='default-font'>Thanks! Your report will be examined as soon as possible.</span>"
      },
      imageExport: {
        title: "Export as image",
        content: "<canvas width='360' height='400' id='export-image-canvas'>"
      }
    };
  };

  // TODO: Desc
  this.displayContributors = function() {
    MessageBox.show(messageBoxes.contributors.title, messageBoxes.contributors.content);
    $("#contributors").html("");
    for (let i = 0; i < contributors.length; ++i) {
      $("#contributors").append("- " + contributors[i] + "<br>")
    }
  };

  // TODO: Desc
  this.displaySettings = function() {
    MessageBox.show(messageBoxes.settings.title, messageBoxes.settings.content);
    $("#team-level-label").text(Setting.get("teamLevel"));
    $("#team-level").val(Setting.get("teamLevel"));
    $("#setting-dev-name").attr("checked", Setting.get("displayDevNames"));
    $("#setting-local-cache").attr("checked", Setting.get("disableCache"));
  };

  // TODO: Desc
  this.displayExportImage = function() {
    let drawingInterval = -1;
    MessageBox.show(messageBoxes.imageExport.title, messageBoxes.imageExport.content, false, function() {
      clearInterval(drawingInterval);
    });

    let canvas = document.getElementById("export-image-canvas");
    let ctx = canvas.getContext("2d");

    if (!Setting.get("buyOrderEnabled")) {
      canvas.height = 320;
    }

    drawingInterval = setInterval(function() {
      Build.current.drawBuildOnCanvas(ctx, canvas);
    }, 100); // requestAnimationFrame could be used but it's easier to stop it this way and we are only genering a static image
  };

  // TODO: Desc
  this.displayDebug = function() {
    MessageBox.close();
    MessageBox.show(messageBoxes.debug.title, messageBoxes.debug.content);

    document.getElementById("custom-import").addEventListener("paste", (event) => {
      event.preventDefault();
      NautController.debugSetTempSpreadsheetData((event.clipboardData || window.clipboardData).getData("text"));
    });

    $("#debug-status-scaling").text(Setting.get("debugDisplayScaleType") ? "Disable" : "Enable");
    $("#debug-status-debug-naut").text(Setting.get("debugDisplayNaut") ? "Disable" : "Enable");
    $("#debug-status-cross-row").text(Setting.get("debugDisableCrossRowParser") ? "Disable" : "Enable");
    $("#debug-status-math-parser").text(Setting.get("debugDisableMathParser") ? "Enable" : "Disable");
    $("#debug-status-rci-display").text(Setting.get("debugRCIDisplay") ? "Disable" : "Enable");
  };

  // TODO: Desc
  this.displayErrorReport = function() {
    MessageBox.show(messageBoxes.errorsReport.title, messageBoxes.errorsReport.content);
    // Add nauts to the list
    for (let i = 0; i < Naut.list.length; ++i) {
      $("#re-naut-list").append($("<option>").text(Naut.list[i].getName()));
    }

    // Display upgrade list when naut is selected
    $("#re-naut-list").on("change", function() {
      $("#re-upgrade-list").attr("disabled", false);
      $("#re-upgrade-list").html("<option value='0'>Please select an upgrade</option>");

      let naut = Naut.getByName($(this).val());
      if (naut === false) {
        // Can't find the naut => we reset the upgade list
        $("#re-upgrade-list").attr("disabled", true);
        $("#re-upgrade-list").html("<option value='0'>Please select a Naut</option>");
        return;
      }

      // Add the list of skill - upgrades for the naut
      for (let j = 0; j < naut.getSkills().length; ++j) {
        $("#re-upgrade-list").append("<option>" + naut.getSkills(j).getName() + "</option>");
        for (let k = 0; k < naut.getSkills(j).getUpgrades().length; ++k) {
          $("#re-upgrade-list").append("<option>" + naut.getSkills(j).getName() + " - " + naut.getSkills(j).getUpgrades(k).getName() + "</option>");
        }
      }
    });

    $("#re-send").on("click", function() {
      // TODO: Move this somewhere else
      let desc = $("#re-desc").val();
      let naut = $("#re-naut-list").val();
      let upgrade = $("#re-upgrade-list").val();

      if (!desc) {
        return;
      }

      $.post(CONFIG.apiURL, {
        action: "nautsbuilder-add-report",
        naut: naut,
        upgrade: upgrade,
        desc: desc
      }, function(data, textStatus) {
        console.log(data);
      });

      MessageBox.close();
      MessageBox.show(messageBoxes.errorsReport.title, messageBoxes.errorsReport.sent);
    });
  };
};
