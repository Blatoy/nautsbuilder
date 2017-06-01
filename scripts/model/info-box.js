/**
 * var InfoBox - InfoBoxes are the little black boxes that contains the summary
 * @param {string} content The text to display inside the box, supports HTML
 * @param {string} className The className applied to the InfoBox. Used to set the position of the box
 */
var InfoBox = function(content, className) {
  var self = this;
  this.content = "";
  this.className = "";
  this.isVisible = false;

  /**
   * var init - "Constructor" for this "class"
   *
   * @param  {string} content See class description
   * @param  {string} className See class description
   */
  var init = function(content, className){
    self.content = content;
    self.className = className;
  };


  init(nautAPIData);
};
