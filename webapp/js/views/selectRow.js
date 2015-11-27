var Backbone,_,Backform;
Backbone = require('backbone');
$ = Backbone.$;
_ = require('underscore');
var Backgrid = require('backgrid');
var queue = require('commoncollection').queueCollection;
var SelectRow = Backgrid.Row.extend({
	events : {
		click : "c"
	},
	initialize:function(options){
		Backgrid.Row.prototype.initialize.call(this,options);
		var self=this;
		this.listenTo(this.model,"click",function(view){
			queue.last().set({_selectedRow:self.model,silent:true});
			self.$el.addClass("tr_selected").siblings().removeClass("tr_selected");
		});
		this.listenTo(this.model,"batchError",function(view){
			self.$el.addClass("checkRow errorRow")
		});
	},
	c:function(e) {
		e.stopPropagation();
		var target = $(e.currentTarget);
		var self=this;
		queue.last().set({_selectedRow:self.model,silent:true});
		$(target).addClass("tr_selected").siblings().removeClass("tr_selected");
	}
});
module.exports = SelectRow;