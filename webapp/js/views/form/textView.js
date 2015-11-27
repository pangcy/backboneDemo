var Backbone,$,baseFormBackbone;
Backbone = require('backbone');
baseFormBackbone=require("../base/baseFormBackbone");
$ = Backbone.$;
_ = require('underscore');
var textView = baseFormBackbone.View.extend({
	tagName : 'div',
	className : 'ui-form-item',
	searchTemplate : require('../../template/search_ui_form_item'),
	initialize : function() {
		textView.__super__.initialize.call(this);
		this.render();
	},
	render:function() {
		var self = this;
		self.$el.empty();
		if(this.model.get("_selectModel")){
			var textvalue = self.model.get("_selectModel").get(self.model.get("name"));
		}
		var template = this.searchTemplate({
			name : self.model.get("name"),
			label: self.model.get("label"),
			value:textvalue
		});
		self.$el.append(template);
		self = null;
		return this;
	},
});
module.exports = textView;
