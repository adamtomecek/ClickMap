window.ClickMapAdmin = (function() {
  var base;

  base = ClickMapAdmin;

  function ClickMapAdmin(container) {
    this.container = container;
    this.path = window.location.pathname;
    this.createAdminPanel();
    this.createHeatmapArea();
    this.loadHeatmapData();
  }

  ClickMapAdmin.prototype.loadHeatmapData = function() {
    var container, containerX, containerY, dateFrom, dateTo, maxHeight, maxWidth, minHeight, minWidth, url;
    container = $(this.container);
    containerX = container.offset().left;
    containerY = container.offset().top;
    minWidth = $("#clickmap_min_width").val();
    maxWidth = $("#clickmap_max_width").val();
    minHeight = $("#clickmap_min_height").val();
    maxHeight = $("#clickmap_max_height").val();
    dateFrom = $("#clickmap_date_from").val();
    dateTo = $("#clickmap_date_to").val();
    url = "/clickmap/admin/clicks?page=" + (encodeURI(this.path)) + "&min_w=" + minWidth + "&max_w=" + maxWidth + "&min_h=" + minHeight + "&max_h=" + maxHeight + "&from=" + dateFrom + "&to=" + dateTo;
    return $.getJSON(url, (function(_this) {
      return function(data) {
        var d, max, _i, _len;
        max = Math.max.apply(Math, data.map(function(o) {
          return o.count;
        }));
        for (_i = 0, _len = data.length; _i < _len; _i++) {
          d = data[_i];
          d.x += containerX;
          d.y += containerY;
        }
        _this.heatmap.store.setDataSet({
          max: max,
          data: data
        });
        _this.heatmapArea.show();
        return _this.heatmap.toggleDisplay();
      };
    })(this));
  };

  ClickMapAdmin.prototype.createHeatmapArea = function() {
    var heatmapEl;
    this.heatmapArea = $("<div/>").attr('id', 'clickmap_heatmap_area');
    $("body").prepend(this.heatmapArea);
    heatmapEl = document.getElementById("clickmap_heatmap_area");
    this.heatmap = h337.create({
      element: heatmapEl,
      radius: 10,
      visible: false
    });
    this.heatmapArea.hide();
    return this.heatmapArea.click((function(_this) {
      return function() {
        if (_this.heatmap.get("visible")) {
          _this.heatmapArea.hide();
          return _this.heatmap.toggleDisplay();
        }
      };
    })(this));
  };

  ClickMapAdmin.prototype.createAdminPanel = function() {
    var form, panel;
    panel = $("<div/>").attr('id', "clickmap_admin");
    form = "<form id='clickmap_form'>";
    form += "<label for='clickmap_min_width'>Min width: </label>";
    form += "<input class='size' id='clickmap_min_width'>";
    form += "<label for='clickmap_max_width'>Max width: </label>";
    form += "<input class='size' id='clickmap_max_width'>";
    form += "<label for='clickmap_min_height'>Min height: </label>";
    form += "<input class='size' id='clickmap_min_height'>";
    form += "<label for='clickmap_max_height'>Max height: </label>";
    form += "<input class='size' id='clickmap_max_height'><br>";
    form += "<label for='clickmap_date_from'>Date from: </label>";
    form += "<input class='date' id='clickmap_date_from' placeholder='yyyy-mm-dd'>";
    form += "<label for='clickmap_date_to'>Date to: </label>";
    form += "<input class='date' id='clickmap_date_to' placeholder='yyyy-mm-dd'>";
    form += "<input type='submit' value='reload'>";
    form += "<a href='#' id='clickmap_enable'>Enable clickmap</a>";
    form += "</form>";
    panel.html(form);
    $("body").prepend(panel);
    $("#clickmap_form").on('submit', (function(_this) {
      return function(e) {
        e.preventDefault();
        return _this.loadHeatmapData();
      };
    })(this));
    $("#clickmap_enable").click((function(_this) {
      return function(e) {
        e.preventDefault();
        _this.heatmapArea.show();
        return _this.heatmap.toggleDisplay();
      };
    })(this));
    return true;
  };

  return ClickMapAdmin;

})();
