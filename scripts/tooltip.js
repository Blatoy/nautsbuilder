var Tooltip = function(tooltipSelector) {
  var self = this;
  var tooltipElement = $(tooltipSelector);
  var offset = {x: 5, y: 5}; // Offsets the tooltip a bit to prevent it being behind the mouse

  /**
   * Must be called when the mouse is moved to change the position of the tooltip
   * @param {MouseMoveEvent} e - A MouseMove event
   */
  this.onMouseMove = function(e) {
    var mousePos = {x: e.pageX || e.clientX, y: e.pageY || e.clientY};
    tooltipElement.css("left", (mousePos.x  + offset.x) + "px");
    tooltipElement.css("top", Math.min((mousePos.y + offset.y), $(window).height() - tooltipElement.outerHeight()) + "px");
  }

  /**
   * Hide the tooltip
   */
  this.remove = function() {
    tooltipElement.hide();
  }

  /**
   * Set the text of the tooltip and display it
   * @param {string} string - The text of the tooltip. Supports HTML
   */
  this.display = function(string) {
    tooltipElement.html(string);
    tooltipElement.show();
  };
};
