/**
 * let Tooltip - Displayed at mouse position when .show is called, they are boxes displayed when hovering a skill
 */
let Tooltip = function(content) {
  let self = this;

  this.visible = false;
  this.jQueryElement = undefined;

  this.show = function() {
    this.visible = true;
    self.jQueryElement = $("<div/>");
    self.jQueryElement.html(content);
    self.jQueryElement.addClass("tooltip");
    self.jQueryElement.show();
    self.jQueryElement.appendTo("body");
    // NB: This is a workaround because sometimes onmouseleave is called with no reason and I didn't find another way to fix it...
    self.setPosition(MainView.mousePos.x, MainView.mousePos.y);
    Tooltip.updateList.push(this);
  };

  this.hide = function() {
    this.visible = false;

    // Prevent hiding selected tooltips when they are freezed
    if (!Tooltip.positionUpdateEnabled) return;

    this.jQueryElement.remove();
    Tooltip.updateList.splice(Tooltip.updateList.indexOf(this), 1);
  };

  this.setPosition = function(x, y) {
    this.jQueryElement.css("left", Math.min(x + Tooltip.offset.x, $(window).width() - this.jQueryElement.outerWidth()) + "px");
    this.jQueryElement.css("top", Math.min((y + Tooltip.offset.y), $(window).height() - this.jQueryElement.outerHeight()) + "px");
  };

  this.setContent = function(content) {
    this.jQueryElement.html(content);
  };
};

Tooltip.createDefault = function(jQueryElement, content) {
  let t = new Tooltip(content);

  jQueryElement.on("mouseenter", function() {
    if (Tooltip.positionUpdateEnabled || Tooltip.updateList.length == 0) {
      t.show();
    }
  });
  jQueryElement.on("mouseleave", function() {
    t.hide();
  });

  return t;
};

Tooltip.list = [];
Tooltip.updateList = [];
Tooltip.offset = {
  x: 20,
  y: 20
};
Tooltip.positionUpdateEnabled = true;

Tooltip.togglePositionUpdateActivation = function() {
  Tooltip.positionUpdateEnabled = !Tooltip.positionUpdateEnabled;
  if (Tooltip.positionUpdateEnabled) {
    for (let i = 0; i < Tooltip.updateList.length; ++i) {
      if (!Tooltip.updateList[i].visible) {
        Tooltip.updateList[i].hide();
      }
    }
  }
}

Tooltip.onMouseMove = function(e) {
  let x = e.pageX || e.clientX;
  let y = e.pageY || e.clientY;

  if (!Tooltip.positionUpdateEnabled) {
    return;
  }

  for (let i = 0; i < Tooltip.updateList.length; ++i) {
    Tooltip.updateList[i].setPosition(x, y);
  }
};
