var basebackbone, $, _,Backbase;
basebackbone = require('../base/basebackbone');
$ = require('jquery');
_ = require('underscore');
Backbase = require('backbase');
var tabCollection = require('commoncollection').tabCollection;
var queue = require('commoncollection').queueCollection;
var dialog = require('artdialog');
var ButtonView = basebackbone.View
		.extend({
			functions : {
				"add" : "execAdd",
				"update" : "exeUpd",
				"info" : "execInfo",
				"delete" : "execDelete",
			},
			tagName : 'a',
			className : 'ui-button ',
			events : {
				'click' : 'open'
			},
			initialize : function(options) {
				this._selectModel = options._selectModel;
				this.render();
			},
			render : function() {
				this.$el.text(this.model.get('label'));
				this.$el.addClass("ui-button-blue");
				return this;
			},
			has : function(arr, data) {
				if (!arr) {
					return false;
				}
				for (var i = 0, len = arr.length; i < len; i++) {
					if (arr[i] == data) {
						return true;
					}
				}
				return false;
			},
			addTab : function() {
				var sid = this.model.get("buttonModel").sid;
				var viewModel = tabCollection.get(sid)
						|| allModelCollection.get(sid);
				viewModel.set({
					_selectModel : this._selectModel
				});
				if (tabCollection.get(sid)) {
					viewModel.trigger('refresh');
				} else {
					tabCollection.add(viewModel);
				}
			},
            execAdd:function(){
                this.addTab();
            },
			exeUpd : function(e) {
				this.addTab();
			},
			execInfo : function(e) {
				this.addTab();
			},
			execCancel:function(e){
				var self=this;
				self.openConfirm("作废", "<div style='padding:0px 30px'>确认要作废吗?</div>", function() {
					var newmodel = Backbase.LoginModel.extend({
						url:self._selectModel.get("_links").cancel.href
					});
					newmodel = new newmodel({
						id:self._selectModel.get("id")
					});
					newmodel.save(null,{
						success : function(model, response, options) {
							self.openAlert(decodeURI(options.xhr
									.getResponseHeader('message')));
							queue.last().trigger("page:refresh");
						},
						error : function(model, response) {
							self.openAlert(decodeURI(response
									.getResponseHeader('message')));
						},
						wait : true
					})
				});
			},
			execDelete : function(e) {
				var self = this;
				var name=queue.last().get("moduleName");
				name=name.substring(0,name.length-2);
				self.openConfirm("删除", "<div style='padding:0px 30px'>是否要删除该"+name+"?</div>", function() {
					self._selectModel.destroy({
						success : function(model, response, options) {
							self.openAlert(decodeURI(options.xhr
									.getResponseHeader('message')));
							queue.last().trigger("page:refresh");
						},
						error : function(model, response) {
							self.openAlert(decodeURI(response
									.getResponseHeader('message')));
						},
						wait : true
					})
				});
			},
			open : function(e) {
				e.stopPropagation();
				this._selectModel.trigger("click");
				var buttonModel = this.model.get("buttonModel");
				if (buttonModel) {
					this[this.functions[buttonModel.buttonType + ""]]
							(e.currentTarget);
				} else {
					var viewModel = tabCollection.get(this.model
							.get('_viewModuleId'))
					viewModel.set({
						_selectModel : this._selectModel
					});
					if (tabCollection.get(this.model.get('_viewModuleId'))) {
						viewModel.trigger('refresh');
					} else {
						tabCollection.add(viewModel);
					}
				}
				return false;
			}
		});
module.exports = ButtonView;
