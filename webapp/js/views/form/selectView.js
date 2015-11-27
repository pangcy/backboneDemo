var Backbone, $,baseFormBackbone;
Backbone = require('backbone');
baseFormBackbone=require("../base/baseFormBackbone");
$ = Backbone.$;
_ = require('underscore');
var selectView = baseFormBackbone.View.extend({
	tagName : 'div',
	className : 'ui-form-item',
	template : require('../../template/ui_form_item_select'),
	initialize : function() {
		selectView.__super__.initialize.call(this);
		if(this.model.get("configer")){
			var configer=JSON.parse(this.model.get("configer"));
			this.configer=configer;
		}
		this.render();
	},
	getValue:function(){
		return this.$el.find("select:eq(0)").val();
	},
	render : function() {
		var self = this,template,option = [],configer = self.configer,defaultvalue=""
			,selectModel=self.model.get("_selectModel");
		self.$el.empty();
		template = this.template({
			name : self.model.get("name"),
			label: self.model.get("label")
		});
		self.$el.append(template);
		var sel = Backbone.Collection.extend({});
		self.selects = new sel();
		if(self.model.get("flag")=='search'){
			option.push('<option value="">全部</option>');
		}else{
			option.push('<option value="">请选择</option>');
		}
		if(configer){
			defaultvalue = configer.defaultvalue;
			if(configer.arrays){
				self.selects.reset(configer.arrays);
			}else{
				if(configer.url){
					self.selects.fetch({url:configer.url,async: false});
				}
			}
		}
		self.selects.each(function(s){
			if(selectModel){
				if(selectModel.get(self.model.get("name"))==s.get(configer.value)){
					option.push('<option value="'+s.get(configer.value)+'" selected="selected">'+s.get(configer.lable)+'</option>');
				}else{
					option.push('<option value="'+s.get(configer.value)+'">'+s.get(configer.lable)+'</option>');
				}
			}else{
				if(defaultvalue ===s.get(configer.value)){
					option.push('<option value="'+s.get(configer.value)+'" selected="selected">'+s.get(configer.lable)+'</option>');
				}else{
					option.push('<option value="'+s.get(configer.value)+'">'+s.get(configer.lable)+'</option>');
				}
			}
		});
		self.$el.find("select").append(option.join(''));
		return this;
	}
});
module.exports = selectView;
