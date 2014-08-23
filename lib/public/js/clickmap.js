window.ClickMap = (function() {
  function ClickMap(container) {
    var path;
    this.container = container;
    path = window.location.pathname;
    $(this.container).click(function(e) {
      var containerX, containerY, height, mouseX, mouseY, width;
      containerX = $(this).offset().left;
      containerY = $(this).offset().top;
      width = window.innerWidth;
      height = window.innerHeight;
      mouseX = e.pageX - containerX;
      mouseY = e.pageY - containerY;
      return $.post("/clickmap/click/" + mouseX + "/" + mouseY + "/" + width + "/" + height + "?page=" + path);
    });
  }

  return ClickMap;

})();
