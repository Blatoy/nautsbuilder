// Tools
var preloadedImages = [];

/**
 * Replaces \n by <br>
 * @param {string} string - The text to convert
 */
function nl2br(string) {
  return string.replace(/\n/g, "<br>");
};

/**
 * Load an image an store it into an array to load it.
 * @param {string} src - The source of the image
 */
function preloadImage(src){
  var img = new Image();
  img.src = src;
  preloadedImages.push(img);
};

/**
 * Change the URL with the specified paramValue
 * @param {string} paramName - The paramater to change in the URL
 * @param {string} paramValue - The string to add in the URL
 */
function setGetParameter(paramName, paramValue) {
  window.history.replaceState(paramValue, "", paramValue);
}

/**
 * Get the text of a parameter in the URL
 * Source: http://stackoverflow.com/questions/11582512/how-to-get-url-parameters-with-javascript/11582513#11582513
 * @param {string} name - The name of the parametic
 */
function getURLParameter(name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
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
  var a = str.split(""), n = a.length;

  for(var i = n - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i];
      a[i] = a[j];
      a[j] = tmp;
  }
  return a.join("");
}

/**
 * Returns a string usable for an element ID
 * @param {string} str - The string to clean
 */
function getValidElementId(str) {
  return str.replace(/^[^a-z]+|[^\w:.-]+/gi, "");
}

/**
 * Shuffle and return the specified array
 * Source: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
 * @param {array} array - The array to shuffle
 */
function shuffleArray(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

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

function round(number) {
  return Math.round(number * 100) / 100;
}
