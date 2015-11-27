var Backbone,$,_;
Backbone = require('backbone');
$ = Backbone.$;
_ = require('underscore');
var searchtextView = Backbone.View.extend({
	tagName : 'div',
	className : 'ui-form-item search-field',
	searchTemplate : require('../../template/search_ui_form_item'),
	events : {
		"keyup :input" : "search",
		"blur :input" : "removeTextBox",
		"mouseover .text" : "setBackgroundColor",
	},
	initialize : function() {
		this.render();
	},
	render:function() {
		var self = this;
		self.$el.empty();
		var template = this.searchTemplate({
			name : self.model.get("name"),
			label: self.model.get("label"),
		});
		self.$el.append(template);
		this.$el.find(':input')[0].autocomplete="off";
		self = null;
		this.textValuepre = '';
		return this;
	},
	search:function(e) {
		if(e.currentTarget.value){
			var textboxes = this.$el.find(".text");
			if(e.keyCode==38 && textboxes.length>0){
				var selectdiv = this.$el.find('.select');
				if(selectdiv.length>0){
					selectdiv.removeClass('select');
					if(selectdiv.prev().length>0){
						selectdiv.prev().addClass('select');
						this.$el.find(':input')[0].value = selectdiv.prev()[0].innerHTML;
						this.textValuepre =selectdiv.prev()[0].innerHTML;
					}else{
						if(textboxes.length>0){
							textboxes[textboxes.length-1].className = 'text select';
							this.$el.find(':input')[0].value = textboxes[textboxes.length-1].innerHTML;
							this.textValuepre = textboxes[textboxes.length-1].innerHTML;
						}
					}
				}else{
					if(textboxes.length>0){
						textboxes[textboxes.length-1].className = 'text select';
						this.$el.find(':input')[0].value = textboxes[textboxes.length-1].innerHTML;
						this.textValuepre = textboxes[textboxes.length-1].innerHTML;
					}
				}
			}else if(e.keyCode==40 && this.$el.find(".textbox").length>0){
				var selectdiv = this.$el.find('.select');
				if(selectdiv.length>0){
					selectdiv.removeClass('select');
					if(selectdiv.next().length>0){
						selectdiv.next().addClass('select');
						this.$el.find(':input')[0].value = selectdiv.next()[0].innerHTML;
						this.textValuepre =selectdiv.next()[0].innerHTML;
					}else{
						if(textboxes.length>0){
							textboxes[0].className = 'text select';
							this.$el.find(':input')[0].value = textboxes[0].innerHTML;
							this.textValuepre = textboxes[0].innerHTML;
						}
					}
				}else{
					if(textboxes.length>0){
						textboxes[0].className = 'text select';
						this.$el.find(':input')[0].value = textboxes[0].innerHTML;
						this.textValuepre = textboxes[0].innerHTML;
					}
				}
			}else if(e.keyCode==13){
				this.removeTextBox();
			}else if(!this.textValuepre || this.textValuepre != e.currentTarget.value){
				this.textValuepre = e.currentTarget.value;
				this.removeTextBox();
				var top = this.$el.find(':input').position().top;
				var left = this.$el.find(':input').position().left;
				var height = this.$el.find(':input').height();
				var width = this.$el.find(':input').width()+12;
				var top = top+height+12;
				this.$el.append('<div class="textbox" style="top:'+top+'px;width:'+width+'px;left:'+left+'px;display:inline"></div>');
				this.$el.find(".textbox").append('<div class = "text">4441</div>');
				this.$el.find(".textbox").append('<div class = "text">4442</div>');
				this.$el.find(".textbox").append('<div class = "text">4443</div>');
				this.$el.find(".textbox").append('<div class = "text">4444</div>');
			}
		}else{
			this.removeTextBox();
		}
	},
	setBackgroundColor:function(e) {
		var selectdiv = this.$el.find('.select');
		if(selectdiv.length>0){
			selectdiv[0].className = 'text';
		}
		e.currentTarget.className = 'text select';
		this.$el.find(':input')[0].value = e.currentTarget.innerHTML;
		this.textValuepre =e.currentTarget.innerHTML;
	},
	removeTextBox:function(e){
		this.$el.find(".textbox").remove();
	}
	
});
module.exports = searchtextView;
