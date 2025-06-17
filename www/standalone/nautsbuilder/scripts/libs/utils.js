// Tools
let preloadedImages = [];

/**
 * Replaces \n by <br>
 * @param {string} string - The text to convert
 */
function nl2br(string) {
  return string.replace(/\n/g, "<br>");
}

// TODO: Desc
function htmlToText(string) {
  if (!Setting.get("debugDisableCrossRowParser") && !Setting.get("debugDisableMathParser")) {
    return nl2br($("<p>" + string + "</p>").text()).replace("*", "<i>").replace("*", "</i>");
  } else {
    return nl2br($("<p>" + string + "</p>").text()); // Disable ** italic when debug enabled
  }
}

/**
 * Send a query to the requested API, call the callback method if failed / successful
 * @param {string} action - The action to request on the API
 * @param {function(data, textStatus)} callback - The function called after querying the API
 */
function queryAPI(action, callback) {
  $.post(CONFIG.apiURL, {
    action: action
  }, function(data, textStatus) {
    if (callback) {
      callback(data, textStatus);
    }
  }, "json");
}

/**
 * Load an image an store it into an array to load it.
 * TODO: Store in local storage and check if it's already present to reduce loading time
 * @param {string} src - The source of the image
 */
function preloadImage(src) {
  let img = new Image();
  img.src = src;
  preloadedImages.push(img);
}

/**
 * Change the URL with the specified paramValue
 * @param {string} hash - The value to set after the default URL
 */
function setHash(hash) {
  location.replace("#" + hash);
}

/**
 * TODO: Desc
 */
function getURLData() {
  let url = window.location.href;
  if (url.indexOf("?b=") != -1) {
    url = url.split("?b");
    window.history.pushState({}, "", url[0]);
    return url[1];
  }

  if (url.indexOf("#") != -1) {
    return url.split("#")[1];
  }

  return false;
}

/**
 * Return true if the specified object is a number
 * @param {Object} n - The name of the parametic
 */
function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

/**
 * Shuffle the given string
 * @param {string} str - The string to shuffle
 */
function shuffleString(str) {
  let a = str.split(""),
    n = a.length;

  for (let i = n - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let tmp = a[i];
    a[i] = a[j];
    a[j] = tmp;
  }
  return a.join("");
}

/**
 * Returns a string usable for an element ID
 * @param {string} str - The string to clean
 */
function getCleanString(str) {
  return str.replace(/^[^a-z]+|[^\w:.-]+|[_]/gi, "");
}

/**
 * Shuffle and return the specified array
 * Source: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
 * @param {array} array - The array to shuffle
 */
function shuffleArray(array) {
  let currentIndex = array.length,
    temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

/**
 * getNumberInfo - Returns useful informations about a given string
 * If the unit has more than 1 character the number will be considered as a string
 * @param {string} str
 * @return {object} {unit: "none", "type": "number|text", value: ""}
 */
function getNumberInfo(str) {
  if (str === undefined) {
    return {
      unit: "none",
      type: "undefined",
      value: undefined
    };
  }
  // Number without unit
  if (isNumeric(str)) {
    return {
      unit: "none",
      type: "number",
      value: parseFloat(str)
    };
  } else {
    // Strings contains some unparser math
    if (str.includes("[") && str.includes("]")) {
      // Remove any spaces just in case
      let cleanStr = str.replace(/\s/g, "");
      // This string contains some unparsed math, let's try to find a unit
      if (cleanStr[cleanStr.length - 1] == "]") {
        return {
          unit: "none",
          type: "unparsedMath",
          value: str
        };
      } else {
        // There's something that could look like a unit
        return {
          unit: cleanStr[cleanStr.length - 1],
          type: "number",
          value: str
        };
      }
    } else if (isNumeric(str.substring(0, str.length - 1)) && !isNumeric(str.substring(str.length - 1))) {
      return {
        unit: str.substring(str.length - 1),
        type: "number",
        value: parseFloat(str.substring(0, str.length - 1))
      };
    } else {
      return {
        unit: "none",
        type: "text",
        value: str
      }; // we only want 1-digit units, we assume this is a string
    }
  }
}

// Source: https://stackoverflow.com/questions/1026069/how-do-i-make-the-first-letter-of-a-string-uppercase-in-javascript
function capitalizeFirstLetter(string) {
  if (string === undefined)
    return;
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function round(number) {
  return Math.round(number * 100) / 100;
}
