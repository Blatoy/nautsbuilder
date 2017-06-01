var EventManager = new function() {
  /**
   * Add an event
   * @param {string} selector - The text of the tooltip. Supports HTML
   * @param {string} eventName - The name of the event (without the "on")
   * @param {function} onTrigger - The function to call when the event is triggered
   */
  this.addEvent = function(selector, eventName, onTrigger) {
    $(selector).on(eventName, onTrigger);
  };

  /**
   * Remove an event
   * @param {string} selector - The text of the tooltip. Supports HTML
   * @param {string} eventName - The name of the event (without the "on")
   * @param {function} onTrigger - The function associated to the event you want to remove
   */
  this.removeEvent = function(selector, eventName, onTrigger) {
    $(selector).off(eventName, onTrigger);
  };
};
