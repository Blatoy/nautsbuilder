let MessageBox = {
  init: function() {
    MessageBox.jQueryBackElement = $("<div>").attr("id", "message-box-background").appendTo("body").hide()
      .on("click", function(e) {
        if (e.target.id == "message-box-background") {
          MessageBox.close();
        }
      });
    MessageBox.jQueryElement = $("<div>").attr("id", "message-box").appendTo(MessageBox.jQueryBackElement);
  },
  show: function(title, content, size, onClose = function() {}) {
    if (!size) {
      size = 60;
    }
    MessageBox.onClose = onClose;
    MessageBox.jQueryElement.html(title + "<hr>" + "<span class='small-text'>" + content + "</span>");
    MessageBox.jQueryBackElement.show();
    MessageBox.jQueryElement.css("margin-left", $(document).width() / 2 - (MessageBox.jQueryElement.outerWidth() / 2) + "px");
  },
  close: function() {
    if (MessageBox.onClose) {
      MessageBox.onClose();
    }
    MessageBox.jQueryBackElement.hide();
  }
};
