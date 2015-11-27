(function (root, factory) {

  // CommonJS
  if (typeof exports == "object") {
    module.exports = factory(require("backbone"), require("backgrid"));
  }
  // Browser
  else factory(root.Backbone, root.Backgrid);

}(this, function (Backbone, Backgrid) {

  "use strict";
  var button = require('../views/pageView/buttonTrView');
  var RowButtonCell = Backgrid.Extension.RowButtonCell = Backbone.View.extend({
    className: "row-button-cell",
    tagName: "td",
    events: {
      "keydown input[type=button]": "onKeydown",
      "click input[type=button]": "enterEditMode"
    },
    initialize: function (options) {
      this.column = options.column;
      if (!(this.column instanceof Backgrid.Column)) {
        this.column = new Backgrid.Column(this.column);
      }
      var column = this.column, model = this.model, $el = this.$el;
      this.listenTo(column, "change:renderable", function (column, renderable) {
        $el.toggleClass("renderable", renderable);
      });
      if (Backgrid.callByNeed(column.renderable(), column, model)) $el.addClass("renderable");
    },
    enterEditMode: function (e) {
	   e.stopPropagation();
	   return false;
    },
    exitEditMode: function () {
      this.$el.find("input[type=button]").blur();
    },
    onKeydown: function (e) {
    	e.stopPropagation();
    },
    render: function () {
      var b = new button({model:this.column,_selectModel:this.model});
      this.$el.append(b.$el);
      this.delegateEvents();
      return this;
    }
  });
}));
