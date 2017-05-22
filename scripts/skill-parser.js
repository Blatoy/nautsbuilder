var SkillParser = new function() {
  // TODO: Edit this function to handle > > >
  this.parseSkillStep = function(step) {
    var stepEffectsClean = {};
    // step = "Slowing Power: +20%; Slow duration: 1s;""

    // No ; found this is a mistake and we "fix" it
    if(step.indexOf(";") == -1) {
      step += ";";
    }

    var stepEffects = step.split(";");

    for(var i = 0; i < stepEffects.length; ++i) {
      // Slowing Power: +20%
      var stepEffect = stepEffects[i];
      var stepEffectParsed = stepEffect.split(":");
      // " +20%"
      var value = stepEffectParsed[1];
      if(!value)
        continue;

      // Remove useless spaces
      while(stepEffectParsed[0][0] == " ") {
        stepEffectParsed[0] = stepEffectParsed[0].substring(1);
      }

      stepEffectsClean[stepEffectParsed[0]] = {};

      // Has unit ?
      if(self.getUnit(value) != "none") {
        // Is number after removing unit and space ?
        var valueNoBlanks = value.replace(/ /g, "");

        if(isNumeric(valueNoBlanks.substring(0, valueNoBlanks.length - 1))) {
          // Number + unit
          stepEffectsClean[stepEffectParsed[0]][self.getUnit(value)] = parseFloat(value);
        }
        else {
          // Thing like 0s > 1s > 2s
          // if contain > return like array
          stepEffectsClean[stepEffectParsed[0]]["none"] = value;
        }
      }
      else {
        if(isNumeric((value.replace(/ /g, "")))) {
          // Number w/o unit
          stepEffectsClean[stepEffectParsed[0]]["none"] = parseFloat(value);
        }
        else {
          // Thing like 0 > 1 > 2
          stepEffectsClean[stepEffectParsed[0]]["none"] = value;
        }
      }
    }
    return stepEffectsClean;
  }

  /**
   * Check if the string is a number and has exactly one character for the unit.
   * If it has more than one character it will handled like a string.
   * @param {string} str - The string to get the unit
   * @return {string} The unit or "none" if not found
   */
  this.getUnit = function(str){
    // Check if last char is a unit
    if(isNaN(parseFloat(str.substring(str.length - 1)))) {
      // Check if last char -1 is a number
      if(isNaN(parseFloat(str.substring(str.length - 2)))) {
        return "none"; // we only want 1-digit units
      }
      else {
        return str.substring(str.length - 1);
      }
    }
    else {
      return "none";
    }
  };

  /**
   * Basically replace ; by "<br> -"
   * @param {string} str - The string to format
   * @return {string} The text formated
   */
  this.getUpgradeTextFormated = function(str) {
    var textFormated = str.replace(/;/g, "<br> - ");
    if(textFormated[textFormated.length - 1] == " ") {
      // We assume that we replace at least 1 text...
      return textFormated.substring(0, textFormated.length - 7);
    }
    else {
      return textFormated;
    }
  };

  /**
   * Parse a build URL
   * @param {string} url - The string to parse
   * @return {object} {name = string, build = [false || string], order = [false || array}
   */
  this.parseURLData = function(url) {
    // "nautName/build/build-order"
    // Nibbs/1000000100000010010001000000/17
    var name, build = false, order = false;

    // [0] = nautName [1] = build [2] = build-order
    var data = url.split("/");

    name = data[0];
    if(data[1]) {
      build = data[1];
    }

    if(data[2]) {
      order = data[2].split("-");
    }

    return {name: name, build: build, order: order};
  };
};
