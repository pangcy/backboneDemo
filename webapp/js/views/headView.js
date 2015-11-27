var Backbone, $, headView;
Backbone = require('backbone');
$ = require('jquery');
headView = Backbone.View.extend({
	tagName : 'div',
	className : 'head',
	template : require('../template/head'),
	events : {
	},
	initialize : function() {
		this.render();
	},
	render : function() {
		this.$el.html(this.template());
		return this;
	}
});
module.exports = headView;
