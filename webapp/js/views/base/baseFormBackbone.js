var Backbone = require('./basebackbone');
var _ = require('underscore');
var baseFormBackbone = {};
baseFormBackbone.View = Backbone.View.extend({
	events:{
		"change .textarea-common":"onChange",
		"change :radio":"onChange",
		"change select":"onChange",
		"blur :input:not(select)": "onChange"

	},
	initialize : function() {
		baseFormBackbone.View.__super__.initialize.call(this);
		this.listenTo(this.model, "setData", this.setData);
		if(this.model.get("_selectModel")){
			this.listenTo(this.model.get("_selectModel"),"change",this.render);
		}
		this.validators = this.model.get("validators");
	},
	getValue:function(){
		return this.$el.find(":input").val();
	},
	onChange:function(e){
		e.stopPropagation();
		this.validator();
	},
	validator : function() {
		var self = this;
		if (self.validators && (!self.model.get("flag") || self.model.get("flag") != 'search')) {
			var messages = [];
			var dateType= "";
			var val = this.getValue();
			if(self.model.get("formType")=="date-time-both"){
				if(val[0]=="" && val[1]!=""){
					dateType = "begin";
					val = "";
				}else if(val[0]!="" && val[1]==""){
					dateType = "end";
					val = "";
				}else if(val[0]=="" && val[1]==""){
					dateType = "both";
					val = "";
				}
			}
			_.each(self.validators, function(object) {
				_.each(_.keys(object), function(k) {
					var value = object[k];
					if (k == 'NotBlank' || k == 'NotNull'|| k == 'NotEmpty') {
						k = 'NotBlank';
					}
					if (k == 'size' || k == 'length') {
						k = 'size';
					}
					if (k == 'decimalMin' || k == 'min') {
						k = 'min';
					}
					if (k == 'decimalMax' || k == 'max') {
						k = 'max';
					}
					var message = self[k](val,value);
					if (message) {
						messages.push(message);
					}
				});
			});
			if(messages&&messages.length>0){
				self.$el.find('.ui-form-explain').empty();
			}else{
				if(self.$el.find('.ui-form-explain').hasClass("ui-tiptext")){
					self.$el.find('.ui-form-explain').empty();
				}
			}
			self.$el.removeClass('ui-form-item-error');
			self.$el.find('.ui-form-explain').removeClass('ui-tiptext ui-tiptext-error');
			if (messages && messages.length > 0 && self.model.get("formType")!="date-time-both") {
				self.$el.addClass('ui-form-item-error');
				self.$el.find('.ui-form-explain').addClass('ui-tiptext ui-tiptext-error');
				self.$el.find('.ui-form-explain').prepend(
						'<i class="ui-tiptext-icon iconfont" title="出错">&#xF045;</i>'
								+ messages);
			}else if (messages && messages.length > 0 && self.model.get("formType")=="date-time-both"){
				if(dateType=="begin"){
					self.$el.find('#begin').css({'border':'1px #F00 solid','color':'#F00'});
					self.$el.find('.ui-form-explain').css({'color':'#F00'});
				}else if(dateType=="end"){
					self.$el.find('#end').css({'border':'1px #F00 solid','color':'#F00'});
					self.$el.find('.ui-form-explain').css({'color':'#FF5243'});
				}else if(dateType=="both"){
					self.$el.addClass('ui-form-item-error');
				}
				self.$el.find('.ui-form-explain').addClass('ui-tiptext ui-tiptext-error');
				self.$el.find('.ui-form-explain').prepend(
						'<i class="ui-tiptext-icon iconfont" title="出错">&#xF045;</i>'
								+ messages);
			}
			return messages;
			}
		},
		NotBlank : function(val,object) {
			if (val == null || $.trim(val) == "") {
				return this.model.get("label") + "不能为空";
			} else {
				return null;
			}
		},
		pattern : function(val,object){
			if(val){
				var reg = eval("/"+object.regexp+"/");
				if(!reg.test(val)){
					return object.message;
				}else{
					return null;
				}
			}
		},
		size : function(val,object){
			if(val){
				var min = object.min;
				var max = object.max;
				var message = "";
				var result;
				if(!val || (min && val.length < min) || (max && val.length > max)){
					result = true
				}
				if(result){
					if(min && max && max!=2147483647){
						message = this.model.get("label") + "应在"+min+"-"+max+"个字符之间";
					}else if(min){
						message = this.model.get("label") + "不能小于"+min+"个字符";
					}else if(max){
						message = this.model.get("label") + "不能大于"+max+"个字符";
					}
					return message;
				}
			}
		},
		Email : function(val,object){
			if(val){
				var reg = /^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/;
				if(!reg.test(val)){
					return '邮件格式不正确';
				}
			}
		},
		min : function(val,object){
			if(val){
				if(val<object.value){
					return '不能小于'+object.value;
				}
			}
		},
		max : function(val,object){
			if(val){
				reg = /^[0-9]*$/
				if(!reg.test(val)){
					return '请输入纯数字';
				}
				if(val>object.value){
					return '不能大于'+object.value;
				}
			}
		},
		range : function(val,object){
			if(val){
				var min = object.min;
				var max = object.max;
				var message = this.model.get("label")+"应该";
				var result;
				if(!val || (min && val < min) || (max && val > max)){
					return message + "在"+min+"到"+max+"之间";
				}
			}
		},
		setData : function(trueOrfalse) {
			var messages = this.validator();
			if (messages && messages.length > 0) {
				trueOrfalse.push(false);
			} else {
				var key = this.model.get("name");
				var val = this.getValue();
				if (this.model.get("type") == "Integer") {
					val = parseFloat(val);
				}
				var data = {};
				if(this.model.get("formType")=="date-time-both"){
					if (key.indexOf("Begin") != -1) {
						endName = key.replace("Begin", "End");
					} else if (key.indexOf("begin") != -1) {
						endName = key.replace("begin", "end");
					}
					data[key] = val[0];
					data[endName] = val[1];
				}else{
					data[key] = val;
				}
				this.model.get("_selectModel").set(data, {silent : true});
			}
		},
	});
module.exports = baseFormBackbone;
