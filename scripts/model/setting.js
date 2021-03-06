  // TODO: Desc
  let Setting = new function() {
    let settings = {
      displayDevNames: false,
      disableCache: false,
      teamLevel: 1,
      buyOrderEnabled: true,
      debugDisplayNaut: false,
      debugDisplayScaleType: false,
      debugDisableCrossRowParser: false,
      debugDisableMathParser: false,
      debugRCIDisplay: false
    };

    // TODO: Desc
    this.set = function(key, value, disableLocalStorage) {
      if (settings[key] !== undefined) {
        settings[key] = value;
        if (!disableLocalStorage) {
          localStorage.setItem("config" + key, JSON.stringify(value));
        }
        return true;
      } else {
        return false;
      }
    };

    // TODO: Desc
    this.get = function(key) {
      if (settings[key]) {
        return settings[key];
      } else {
        return false;
      }
    };

    // TODO: Desc
    this.getSettingCheckbox = function(label, key, id) {
      let checked = this.get(key) ? "checked" : "";
      return "<label for='" + id + "'>" + label + "</label>" +
        " <input id='" + id + "' onclick='Setting.set(\"" + key + "\", this.checked)' type='checkbox' " + checked + ">";
    };

    this.setTeamLevel = function(value) {
      // We don't store team level in localStorage
      // This could be done in the message-box view...
      // TODO: Create and call MessageBoxView.setSettingTeamLevel()
      $("#team-level-label").text(value);
      settings.teamLevel = value;
      InfoBoxView.setBuildSummaryContent();
      // Reset current infoboxes
    };

    // TODO: Desc
    this.toggleBuyOrder = function() {
      settings.buyOrderEnabled = !settings.buyOrderEnabled;
      BuildController.refreshViewsAndURL();
      ShopView.showBuildOrderPanel(settings.buyOrderEnabled);
    };

    // TODO: Desc
    this.init = function() {
      // Load settings from localStorage if they exist
      for (let k in settings) {
        if (localStorage.getItem("config" + k) !== null) {
          settings[k] = JSON.parse(localStorage.getItem("config" + k));
        }
      }
    };


    this.debugToggleScaleDisplay = function() {
      settings.debugDisplayScaleType = !settings.debugDisplayScaleType;
      InfoBoxView.setBuildSummaryContent();
    };

    this.debugToggleDebugNaut = function() {
      this.set("debugDisplayNaut", !this.get("debugDisplayNaut"));
      document.location.reload();
    }

    this.debugToggleCrossRow = function() {
      settings.debugDisableCrossRowParser = !settings.debugDisableCrossRowParser;
      InfoBoxView.setBuildSummaryContent();
      // Dirty reset to refresh boxes
      NautController.selectNaut(Build.current.getNaut().getName());
    }

    this.debugToggleMathParser = function() {
      settings.debugDisableMathParser = !settings.debugDisableMathParser;
      InfoBoxView.setBuildSummaryContent();
      // Dirty reset to refresh boxes
      NautController.selectNaut(Build.current.getNaut().getName());
    }

    this.debugToggleRCIDisplay = function() {
      this.set("debugRCIDisplay", !this.get("debugRCIDisplay"));
      document.location.reload();
    }

    this.init();
    return this;
  };
