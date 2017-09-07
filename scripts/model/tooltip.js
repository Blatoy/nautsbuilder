/**
 * var Tooltip - Displayed at mouse position when .show is called, they are boxes displayed when hovering a skill
 */
var Tooltip = function(content) {
  var self = this;
  this.visible = false;
  this.jQueryElement = undefined;

  this.show = function() {
    this.visible = true;
    self.jQueryElement = $("<div/>");
    self.jQueryElement.html(content);
    self.jQueryElement.addClass("tooltip");
    self.jQueryElement.show();
    self.jQueryElement.appendTo("body");
    Tooltip.updateList.push(this);
  };

  this.hide = function() {
    this.visible = false;
    this.jQueryElement.remove();
    Tooltip.updateList.splice(Tooltip.updateList.indexOf(this), 1);
  };

  this.setPosition = function(x, y) {
    this.jQueryElement.css("left", x + "px");
    this.jQueryElement.css("top",  y + "px");
  };

  this.setContent = function(content) {
    this.jQueryElement.html(content);
  };
};

Tooltip.createDefault = function(jQueryElement, content) {
  var t = new Tooltip(content);
  jQueryElement.on("mouseenter", function(){t.show();});
  jQueryElement.on("mouseleave", function(){t.hide();});
  return t;
};

Tooltip.list = [];
Tooltip.updateList = [];
Tooltip.offset = {x: 20, y: 20};

Tooltip.onMouseMove = function(e){
  var x = e.pageX || e.clientX;
  var y = e.pageY || e.clientY;

  for(var i = 0; i < Tooltip.updateList.length; ++i) {
    var tooltip = Tooltip.updateList[i];
    tooltip.setPosition(Math.min(x + Tooltip.offset.x, $(window).width() - tooltip.jQueryElement.outerWidth()),
                        Math.min((y + Tooltip.offset.y), $(window).height() - tooltip.jQueryElement.outerHeight()));
  }
};
