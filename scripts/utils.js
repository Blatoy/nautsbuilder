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
  window.history.pushState(paramValue, "", paramValue);
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
