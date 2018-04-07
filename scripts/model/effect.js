/**
 * var Effect - Describes an effect. An effect is something like: "Damage: 95" or "Slowing Power: 7.5% > 15% > 22.5% > 30%"
 * Effects are stored in skill and upgrades
 * The most important purpose of this class is to parse the data into something we can use
 *
 * @param  {string} effectData Something like: "Damage: 95"
 */
var Effect = function(effectData, scalingTypeRaw) {
  // Type can be: "text", "number" (most upgrades) or "numberArray" (things with > > )
  var unit, key, value, type, scalingType;

  /**
   * var init - "Constructor" for this "class"
   *
   * @param  {string} effectData See class description
   */
  var init = function(effectData, scalingTypeRaw){
    if(!effectData) {
      console.error("effect.js: constructor can't be called without args");
      return false;
    }
    else {
      var effectParsed = Effect.parseString(effectData);
      unit = effectParsed.unit;
      key = effectParsed.key;
      value = effectParsed.value;
      type = effectParsed.type;
      scalingType = scalingTypeRaw;
    }
  };

  // TODO: Desc
  this.toString = function() {
    return Effect.toString({unit: unit, value: value, key: key});
  };

  /**
   * this.getEffectScaling - getter
   *
   * @returns {string}  The effectScaling of this effect. Should be "heal", "damage" or "none"
   */
   this.getEffectScaling = function() {
     return scalingType || "none";
   };

  /**
   * this.getUnit - getter
   *
   * @returns {string}  The unit of this effect
   */
  this.getUnit = function(){
    return unit;
  };

  /**
   * this.getKey - getter
   *
   * @returns {string}  They key of this effect
   */
  this.getKey = function(){
    return key;
  };

  /**
   * this.getValue - getter
   *
   * @param {number} index - The index of the value to get (works only for array)
   * @returns {string|number|array}  The value of this effect, 0 if the effect is a coefficient
   */
  this.getValue = function(index){
    if(this.getUnit() != "%") {
      if(index !== undefined && Array.isArray(value)) {
        return value[index];
      }
      else {
        return value;
      }
    }
    else {
      return 0;
    }
  };

  /**
   * this.getCoeff - getter
   *
   * @param {number} index - The index of the coeff to get (works only for array)
   * @returns {number|array}  The value/100 of this effect, 0 if the effect is a value
   */
  this.getCoeff = function(index){
    if(this.getUnit() == "%") {
      if(Array.isArray(value)) {
        var coeffArray = [];
        for(var i = 0; i < value.length; ++i) {
          coeffArray.push(value[i] / 100);
        }
        if(index !== undefined) {
          return coeffArray[index];
        } else {
          return coeffArray;
        }
      }
      else {
        return value / 100;
      }
    }
    else {
      return 0;
    }
  };

  /**
   * this.getUnit - getter
   * Type can be: "text", "number", "numberArray"
   * @returns {string}  The type of this effect
   */
  this.getType = function(){
    return type;
  };

  init(effectData, scalingTypeRaw);
};

/**
 * Effect.parseEffect - Parses raw effect data
 * Parse data like: "Damage: 95" or "Slowing Power: 7.5% > 15% > 22.5% > 30%"
 *
 * @param  {string} effectData Something like: "Damage: 95"
 * @returns {object} {unit: "", key: "damage", value: 95, type: "number"}
 */
Effect.parseString = function(effectData) {
  var unit = "", key = "", value = "", type = "";
  // Clear stupid white spaces
  effectData = effectData.trim().replace(/(\r\n|\n|\r)/gm,"");
  // Split key and value
  effectData = effectData.split(":");

  if(effectData.length != 2) {
    console.error("effect.js: Failed to parse " + effectData);
    return false;
  }

  key = effectData[0].toLowerCase();
  // Split value and comment, and merge them again
  var rawValue = effectData[1].split("//");
  rawValue = rawValue[0].replace(/\s/g, "") + (rawValue[1] !== undefined ? "//" + rawValue[1] : "");

  // cases to handle:
  // 1 - Damage: 95
  // 2 - Duration: 30s
  // 3 - Damage: 30 > 40 > 50
  // 4 - Duration: 30s > 40s > 50s
  // 5 - RetainsCharges: yes

  if(isNumeric(rawValue)) {
    // 1 -
    type = "number";
    unit = "none";
    value = parseFloat(rawValue);
  }
  else {
    if(rawValue.indexOf(">") == -1) {
      // 2, 5
      var numberInfo = getNumberInfo(rawValue);
      type = numberInfo.type;
      unit = numberInfo.unit;
      value = numberInfo.value;
    }
    else {
      type = "numberArray";
      value = [];

      var rawValues = rawValue.split(">");
      unit = getNumberInfo(rawValues[0]).unit; // We assume that all the values have the same unit
      for(var i = 0; i < rawValues.length; ++i) {
        if(unit == "none") {
          value.push(parseFloat(rawValues[i]));
        }
        else {
          value.push(parseFloat(rawValues[i]));
        }
      }
    }
  }
  return {unit: unit, key: key, value: value, type: type};
};

// TODO: Desc
Effect.toString = function(objectEffect) {
  var displayValue = objectEffect.value;
  var displayUnit = (objectEffect.unit == "none" ? "" : objectEffect.unit);

  if(Array.isArray(displayValue)) {
    displayValue = displayValue.join(displayUnit + " > ");
  }
  else {
    displayValue += "";
  }

  var displayValueParsed;
  if(!Setting.get("debugDisableCrossRowParser")) {
    // Check if the effect has a custom display name
    displayValueParsed = displayValue.split("//");
    if(displayValueParsed[1] !== undefined) {
      // Check if we want the effect to be hidden
      if(displayValueParsed[1] == "hidden") {
        return "";
      }
      else {
        // Effect has custom name
        displayValueParsed = displayValueParsed[1];
      }
    }
    else {
      // Effect uses it's key: value name
      displayValueParsed = displayValueParsed[0];
    }
  }
  else {
    displayValueParsed = displayValue;
  }

  return htmlToText(capitalizeFirstLetter(objectEffect.key)) + ": <span class='effect-value-colored'>" + htmlToText(displayValueParsed) + htmlToText(displayUnit) + "</span>";
};

Effect.EFFECT_SEPARATOR = ";";
