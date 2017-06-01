var SkillParser = new function() {
  var self = this;

// ca parse correctement si le truc est pas coché mais dès que on check le premier truc
// ca transforme le parse correct en qqch de faux genre wtf
  this.parseSkillStep = function(step) {
    // step = "Slowing Power: +20%; Slow duration: 1s;""
    var stepEffectsClean = {};

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

      // Remove useless spaces a the start of the string
      while(stepEffectParsed[0][0] == " ") {
        stepEffectParsed[0] = stepEffectParsed[0].substring(1);
      }

      // We got the key, put in in the return variable
      stepEffectsClean[stepEffectParsed[0]] = {};

      // Passes this test: 4s, 6%
      if(self.getUnit(value) != "none") {
        // Is number after removing unit and space ?
        value = value.replace(/ /g, "");

        // Passes this test: 4s, 6%
        if(isNumeric(value.substring(0, value.length - 1))) {
          // Number + unit
          stepEffectsClean[stepEffectParsed[0]][self.getUnit(value)] = parseFloat(value);
        }
        else {
          // Passes this test: Droids, any string

          // Check if the skill is like "1s > 2s > 3s"
          if(value.indexOf(">") != -1) {
            var splitedValues = value.split(">");
            var values = [];
            for(var j = 0; j < splitedValues.length; ++j) {
              values.push(parseFloat(splitedValues[j]));
            }
            // 1s > 2s > 3s + unit
            stepEffectsClean[stepEffectParsed[0]][self.getUnit(splitedValues[0])] = values;
          } else {
            // No unit (this is a text)
            stepEffectsClean[stepEffectParsed[0]]["none"] = value;
          }
        }
      }
      else {
        // Passes this test: 3, 5
        if(isNumeric((value.replace(/ /g, "")))) {
          // Just a number, no unit
          stepEffectsClean[stepEffectParsed[0]]["none"] = parseFloat(value);
        }
        else {
          // Else it's just text
          if(value.indexOf(">") != -1) {
            var splitedValues = value.split(" > ");
            var values = [];
            for(var j = 0; j < splitedValues.length; ++j) {
              values.push(parseFloat(splitedValues[j]));
            }
            // 1s > 2s > 3s but without unit
            stepEffectsClean[stepEffectParsed[0]]["none"] = values;
          }
          else {
            // No unit (this is a text)
            stepEffectsClean[stepEffectParsed[0]]["none"] = value;
          }
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
