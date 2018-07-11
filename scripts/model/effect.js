/**
 * let Effect - Describes an effect. An effect is something like: "Damage: 95" or "Slowing Power: 7.5% > 15% > 22.5% > 30%"
 * Effects are stored in skill and upgrades
 * The most important purpose of this class is to parse the data into something we can use
 *
 * @param  {string} effectData Something like: "Damage: 95"
 */
let Effect = function(effectData, scalingTypeRaw) {
  // Type can be: "text", "number" (most upgrades) or "numberArray" (things with > > )
  let unit, key, value, type, scalingType, comment;

  /**
   * let init - "Constructor" for this "class"
   *
   * @param  {string} effectData See class description
   */
  let init = function(effectData, scalingTypeRaw) {
    if (!effectData) {
      console.error("effect.js: constructor can't be called without args");
      return false;
    } else {
      let effectParsed = Effect.parseString(effectData);
      unit = effectParsed.unit;
      key = effectParsed.key;
      value = effectParsed.value;
      type = effectParsed.type;
      comment = effectParsed.comment;
      scalingType = scalingTypeRaw;
    }
  };

  // TODO: Desc
  this.toString = function() {
    return Effect.toString({
      unit: unit,
      value: value,
      key: key,
      comment: comment
    });
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
  this.getUnit = function() {
    return unit;
  };

  /**
   * this.getKey - getter
   *
   * @returns {string}  They key of this effect
   */
  this.getKey = function() {
    return key;
  };

  /**
   * this.getValue - getter
   *
   * @param {number} index - The index of the value to get (works only for array)
   * @returns {string|number|array}  The value of this effect, 0 if the effect is a coefficient
   */
  this.getValue = function(index) {
    if (this.getUnit() != "%") {
      if (index !== undefined && Array.isArray(value)) {
        return value[index] + "";
      } else {
        if(Array.isArray(value)) {
          return value.slice();
        }
        else {
          return value + "";
        }
      }
    } else {
      return 0;
    }
  };

  /**
   * this.getCoeff - getter
   *
   * @param {number} index - The index of the coeff to get (works only for array)
   * @returns {number|array}  The value/100 of this effect, 0 if the effect is a value
   */
  this.getCoeff = function(index) {
    if (this.getUnit() == "%") {
      if (Array.isArray(value)) {
        let coeffArray = [];
        for (let i = 0; i < value.length; ++i) {
          coeffArray.push(value[i] / 100);
        }
        if (index !== undefined) {
          return coeffArray[index];
        } else {
          return coeffArray;
        }
      } else {
        return parseFloat(value) / 100;
      }
    } else {
      return 0;
    }
  };

  /**
   * this.getUnit - getter
   * Type can be: "text", "number", "numberArray"
   * @returns {string}  The type of this effect
   */
  this.getType = function() {
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
  // cases to handle:
  // 1 - Damage: 95                 key + number
  // 2 - Duration: 30s              key + number + unit
  // 3 - Damage: 30 > 40 > 50       key + arrayNumber
  // 4 - Duration: 30s > 40s > 50s  key + arrayString + unit
  // 5 - RetainsCharges: yes        key + string
  //
  let unit = "",
    key = "",
    value = "",
    type = "",
    comment = "";

  // Remove any white space
  effectData = effectData.trim().replace(/(\r\n|\n|\r)/gm, "");

  // Split key and value (Damage: 93)
  effectData = effectData.split(":");

  // Something doesn't work properly
  if (effectData.length != 2) {
    console.error("effect.js: Failed to parse " + effectData);
    return false;
  }

  // Normalize the key just in case
  key = effectData[0].toLowerCase();

  // Split value and comment ([0 + 2]//2 damage)
  effectData = effectData[1].split("//");
  let rawValue = effectData[0].replace(/\s/g, "");
  comment = effectData[1] || "";

  let isNumberArray = rawValue.includes(">");

  if (isNumberArray) {
    type = "numberArray";
    let rawValueArray = rawValue.split(">");

    // Find the type using the first item in the array
    let numberInfo = getNumberInfo(rawValueArray[0]);
    unit = numberInfo.unit;

    if (numberInfo.type == "number") {
      rawValueArray = rawValueArray.map(function(e) {
        return parseFloat(e);
      });
    }

    value = rawValueArray;
  } else {
    let numberInfo = getNumberInfo(rawValue);
    type = numberInfo.type;
    unit = numberInfo.unit;
    value = numberInfo.value;
  }

  return {
    unit: unit,
    key: key,
    value: value,
    type: type,
    comment: comment
  };
};

// TODO: Desc
Effect.toString = function(objectEffect) {
  let displayValue = objectEffect.value;
  let displayUnit = (objectEffect.unit == "none" ? "" : objectEffect.unit);
  let comment = objectEffect.comment;

  if (comment == "hidden") {
    return "";
  }

  if (Array.isArray(displayValue)) {
    displayValue = displayValue.join(displayUnit + " > ");
  }

  if (comment) {
    displayValue = comment;
    if (!Setting.get("debugDisableCrossRowParser")) {
      displayUnit = "";
    }
  }

  return htmlToText(capitalizeFirstLetter(objectEffect.key)) + ": <span class='effect-value-colored'>" + htmlToText(displayValue) + htmlToText(displayUnit) + "</span>";
};

Effect.EFFECT_SEPARATOR = ";";
