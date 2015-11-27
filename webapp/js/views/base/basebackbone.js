var Backbone = require('backbone');
var dialog=require("artdialog");
var _ = require('underscore');
var baseBackbone = {};
var queue=0;
var openShadow=function(){
	queue+=1;
	var height=$(window).height();
	var width=$(window).width();
	if(!$("#myShadow").get(0)){
		$("body").append("<div id='myShadow'></div>");
	}else{
		$("#myShadow").show();		
	}
	$("#myShadow").css({
		"width":width,
		"height":height
	});
};
var closeShadow=function(){
	queue-=1;
	if(queue<=0){
		$("#myShadow").hide();
	}
};
var setShadow=function(options){
	if(!options){
		return;
	}
	if(options.shadow){			
		openShadow();
		var success=options.success;
		options.success=function(model,resp,options){
			closeShadow();
			if(success){
				success(model,resp,options);
			}
		};
		var error=options.error;
		options.error=function(model,resp,options){
			closeShadow();
			if(options.error){
				error(model,resp,options);
			}
		}
	}
};
baseBackbone.View = Backbone.View.extend({
	initialize : function() {
		if(this.model){
			this.listenTo(this.model, "myDestroy", this.remove);
		}
	},
	addReferModel : function(_model) {
		if (!this.referModels) {
			this.referModels = new baseBackbone.Collection();
		}
		this.referModels.push(_model);
	},
	addListenModel : function(_model, callback) {
		if (_.isFunction(this[callback])) {
			this.listenTo(_model, "myDestroy", this[callback]);
		} else {
			this.listenTo(_model, "myDestroy", this.remove);
		}
	},
	getView : function() {
		return this.$el;
	},
	getModel : function() {
		return this.model;
	},
	getCollection : function() {
		return this.collection;
	},
	remove : function() {
		this.removeRefers();
		if (this.model) {
			this.model = null;
		}
		if (this.collection) {
			this.collection = null;
		}
		return Backbone.View.prototype.remove.call(this);
	},
	rawRemove:function(){
		return Backbone.View.prototype.remove.call(this);		
	},
	append : function(view) {
		if (_.isString(view)) {
			this.$el.append(view);
		} else {
			if (!this.referModels) {
				this.referModels = new baseBackbone.Collection();
			}
			view.parentView = this;
			this.referModels.push(view.model);
			this.$el.append(view.el);
		}
	},
	removeRefers : function() {
		var self = this;
		if (!this.referModels) {
			return;
		}
		this.referModels.each(function(model) {
			model.trigger("myDestroy");
		});
	}

});
baseBackbone.Model = Backbone.Model.extend({
	getModel : function() {
		return this;
	},
	save : function(attrs,options) {
		setShadow(options);
		return Backbone.Model.prototype.save.call(this, attrs,options);
	},
	fetch : function(options) {
		setShadow(options);
		return Backbone.Model.prototype.fetch.call(this, options);
	},
	destroy : function(options) {
		setShadow(options);
		return Backbone.Model.prototype.destroy.call(this, options);
	}
});
baseBackbone.Collection = Backbone.Collection.extend({
	getCollection : function() {
		return this;
	},
	getModels : function() {
		return this.models;
	},
	fetch : function(options) {
		setShadow(options);
		return Backbone.Collection.prototype.fetch.apply(this, arguments);
	}
});
baseBackbone.Router = Backbone.Router;
baseBackbone.history = Backbone.history;
baseBackbone.$ = Backbone.$;
var extendation={
	
	openAlert : function(content, callback) {
		var dg = dialog({
			content : content
		});
		dg.showModal();
		setTimeout(function() {
			dg.close();
			if (_.isFunction(callback))
				callback();
		}, 1500);
	},
	openAlertByResp:function(options){
		var message;
		if(options.xhr){
			message=options.xhr.getResponseHeader('message');
		}else{
			message=options.getResponseHeader('message');
		}
		this.openAlert(decodeURI(message));
	},
	openConfirm : function(title, content, callback) {
		if(arguments.length==2){
			callback=content;
			content=title;
			title="确认";
		}
		var dg = dialog({
			title : title,
			content : content,
			ok : callback,
			cancel : function() {
			},
			cancelValue : "取消",
			okValue : "确定"
		});
		dg.showModal();
	}
};
_.extend(baseBackbone.Model.prototype,extendation);
_.extend(baseBackbone.View.prototype,extendation);
_.extend(baseBackbone.Collection.prototype,extendation);
baseBackbone.$ = Backbone.$;
module.exports = baseBackbone;
