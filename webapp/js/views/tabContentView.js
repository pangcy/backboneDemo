var $, _,Backbone, baseBackbone, Backgrid;
baseBackbone = require("./base/basebackbone");
Backbone = require("backbone");
$ = require('jquery');
_ = require('underscore');
Backgrid = require('backgrid');
require('../lib/backgrid-button-cell');
require('../lib/backgrid-order-cell');
require('../lib/backgrid-select-all');
var queue = require('commoncollection').queueCollection;
var tabCollection = require('commoncollection').tabCollection;
var trCollection = require('../collection/trCollection');
var Tab = require('./tabOrDialog');
var SelectRow = require('./selectRow');
var paginationView = require('./pageView/paginationView');
var tabContentView = Tab.extend({
			tagName : 'div',
			template : require('../template/rightBottom'),
			events : {
				"click #delete" : "batchDelete"
			},
			initialize : function() {
				tabContentView.__super__.initialize.apply(this, arguments);
				this.render();
				this.listenTo(this.model, 'change:pagelink', this.pagelink);
				this.listenTo(this.model, 'change:page', this.page);
			},
			render : function() {
				try {
					this.$el.empty();
					this.$el.html(this.template({}));
					var formView = require('./form/formView');
					this.tr = new trCollection();
					var elementCollection = new Backbone.Collection([{label:"名字",name:"name",type:"searchtextView"},
							{label:"选择框",name:"name",type:"select",configer:'{"lable":"name","defaultvalue":"","value":"id","arrays":[{"id":0,"name":"其他出票"},{"id":1,"name":"本平台自动出票"},{"id":2,"name":"融易付支付"}]}'},{label:"时间",name:"name",type:"dateTimeBoth"}]);
					var form = new formView({
						model : this.model,
						collection : elementCollection
					});
					this.$el.find('.maintain').html(form.el);
					this.$el.find('.buttons').append($('<a id="delete" class="ui-button ui-button-blue" style="margin-right: 2px;">删除</a>'));
					var myColumns = new Backgrid.Columns();
					myColumns.add({
						name : "order",
						label : "序号",
						cell : "order",
						editable : false,
						sortable : false,
					});
					myColumns.add({
						name : "name",
						label : "name",
						cell : "string",
						editable : false,
					});
					myColumns.add({
						name : "line",
						label : "line",
						cell : "integer",
						editable : false,
					});
					myColumns.add({
						name: "percentage",
					    label: "% of World Population",
					    cell: "number",
						editable : false,
					});
					myColumns.add({
						name: "date",
					    label: "Date",
					    cell: "date",
						editable : false,
					});
					myColumns.unshift({
						name : "",
						label : "",
						cell : "SelectRow",
						headerCell : "SelectAll",
						editable : false,
						sortable : false
					}, {
						silent : true
					});
					myColumns.add({
						name : "cancel",
						label : "作废",
						cell : "RowButton",
						editable : false,
					});
					this.tr = new trCollection([{id:1,name:"111",line:0,percentage:0.34,date:"2010-01-22"},
					                            {id:2,name:"222",line:1,percentage:1.34,date:"2010-01-22"},
					                            {id:3,name:"333",line:2,percentage:2.34,date:"2010-01-22"},
					                            {id:4,name:"444",line:3,percentage:3.34,date:"2010-01-22"},
					                            {id:5,name:"555",line:4,percentage:4.34,date:"2010-01-22"},
					                            {id:6,name:"666",line:5,percentage:5.34,date:"2010-01-22"},
					                            {id:7,name:"777",line:6,percentage:6.34,date:"2010-01-22"},
					                            {id:8,name:"888",line:7,percentage:7.34,date:"2010-01-22"},
					                            {id:9,name:"999",line:8,percentage:8.34,date:"2010-01-22"},
					                            {id:10,name:"111",line:9,percentage:9.34,date:"2010-01-22"}]);
					this.grid = new Backgrid.Grid({
						row : SelectRow,
						columns : myColumns,
						collection : this.tr 
					});
					this.grid.render();
					this.$el.find('.maintainlist').html(this.grid.el);
					this.pushSonView(this.grid);
					var page = new paginationView({
						collection : this.tr,
						model : this.model
					});
					this.$el.find(".page").replaceWith(page.el);
					this.model.trigger("query", form.$el.serialize());
					this.pushSonView(page);
				} catch (e) {
					console.log(e);
				}
				return this;
			},
			batchDelete : function(type) {
				var self = this,list = [];
				alert = baseBackbone.Model.prototype.openAlert,
						confirm = baseBackbone.Model.prototype.openConfirm;
				if (this.tr && this.tr.length > 0) {
					this.tr.each(function(model) {
						if (model.get("selected")) {
							list.push(model.get("id"));
						}
					});
				}
				if (list.length > 0) {
					confirm("批量删除", "<div style='padding:0px 30px'>是否要删除选中的数据?</div>", function() {
						var m = self.tr.last();
						m.save({
							ids : list.join(",")
						}, {
							success : function(model, response, options) {
								alert(decodeURI(options.xhr
										.getResponseHeader('message')));
								self.model.trigger("page:refresh");
							},
							error : function(model, response) {
								alert(decodeURI(response
										.getResponseHeader('message')));
							},
							url : ''
						});
					});
				} else {
					alert("请选择要删除的数据!");
				}
			}
		});
module.exports = tabContentView;
