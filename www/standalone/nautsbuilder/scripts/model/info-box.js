/**
 * let InfoBox - InfoBoxes are the little black boxes that contains the summary
 * @param {string} content The text to display inside the box, supports HTML
 * @param {string} className The className applied to the InfoBox. Use it to set the position of the box
 */
let InfoBox = function(content_, id_, visible_, parentSelector) {
  let self = this;
  let content;
  let visible;
  let id;
  let jQueryElement = $("<div/>");

  /**
   * let init - "Constructor" for this "class"
   *
   * @param  {string} content See class description
   * @param  {string} className See class description
   */
  let init = function(content_, position_, visible_, parentSelector) {
    content = content_ || "";
    id = id_ || "";
    visible = visible_ || false;
    parentSelector = parentSelector || "body";

    jQueryElement
      .addClass("info-box")
      .attr("id", id)
      .html(content);

    if (visible) {
      jQueryElement.show();
    } else {
      jQueryElement.hide();
    }

    if (parentSelector) {
      $(parentSelector).append(jQueryElement);
    }
  };

  // TODO: Add doc
  this.setVisibility = function(visible_, fade) {
    visible = visible_;
    if (visible) {
      if (fade) {
        jQueryElement.fadeIn(200);
      } else {
        jQueryElement.show();
      }
    } else {
      if (fade) {
        jQueryElement.fadeOut(200);
      } else {
        jQueryElement.hide();
      }
    }
  };

  // TODO: Add doc
  this.setContent = function(content_) {
    content = content_;
    jQueryElement.html(content);
  };

  // TODO: Add doc
  this.getElement = function() {
    return jQueryElement;
  };

  init(content_, id_, visible_, parentSelector);
};
