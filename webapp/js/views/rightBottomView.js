var Backbone, _, $, Backbase, ArtDialog;
Backbone = require('backbone');
_ = require('underscore');
$ = Backbone.$;
Backbase = require('backbase');
ArtDialog = require('artdialog');
var queue = require('commoncollection').queueCollection;
var tabCollection = require('commoncollection').tabCollection;
var tabView = require('./tabView');
var rightBottomView = Backbone.View.extend({
	tagName : 'div',
	id : 'tab',
	template : require('../template/tab'),
	events : {
		'click .iconLeft' : 'moveLeft',
		'click .iconRight' : 'moveRight'
	},
	viewMap : {
		"default" : require('./tabContentView')
	},
	initialize : function() {
		this.render();
		this.listenTo(this.collection, 'add', this.maskAdd);
		this.listenTo(this.collection, 'remove', this.modelRemove);
	},
	maskAdd : function(model) {
		var self = this, searchInfoConfigs, prevModel;
		prevModel = queue.last();
		if (!this.maskDialog) {
			this.maskDialog = ArtDialog({});
		}
		this.maskDialog.showModal();
		if (queue.last()) {
			queue.last().trigger('hide');
		}
		queue.push(model);
		self.modelAdd(model, prevModel);
	},
	modelAdd : function(model, prevModel) {
		var tab, tabContent, view, viewType;
		viewType = model.get('viewType') || "default";
		view = this.viewMap[viewType];
		tabContent = new view({
			model : model,
			prevModel : prevModel
		});
		tab = new tabView({
			model : model
		});
		this.$el.find('.ui-switchable-nav').append(tab.$el);
		this.$el.find('.ui-switchable-content:eq(0)').append(tabContent.$el);
		var allHeight = $(window).height();
		// head 50px
		// tab 切换 32px
		// copyright 专利号 20px
		// page 22px
		allHeight = allHeight - 50 - 32 - 20 - 22;
		var maintainHeight = tabContent.$el.find('.maintain').height();
		var buttonsHeight = tabContent.$el.find('.buttons').height();
		var pageCheckboxHeight = 0;
		// 显示字段
		if (tabContent.$el.find('.pageCheckbox').length > 0) {
			pageCheckboxHeight = tabContent.$el.find('.pageCheckbox').height();
		}
		tabContent.$el.find('.maintainlist').css(
				{
					"height" : allHeight - maintainHeight - buttonsHeight
							- pageCheckboxHeight - 33
				});
		tabContent.model.trigger("rendered");
		this.maskDialog.close();
		this.move("right", true);
		return this;
	},
	modelRemove : function(model) {
		model.trigger('removeview');
		if (model.get("_selectedRow")) {
			model.unset("_selectedRow");
		}
		queue.remove(model);
		if (queue.last()) {
			queue.last().trigger('show');
		}
		this.move("left", true);
	},
	render : function() {
		this.$el.html(this.template({}));
		var h = $(window).height() - 112;
		this.$el.find('.ui-switchable-content').height(h).css({
			"overflow" : "auto",
		});
		this.$ul = this.$el.find("ul.ui-switchable-nav");
		return this;
	},
	moveLeft : function(e) {
		e.stopPropagation();
		this.move("left");
	},
	moveRight : function(e) {
		e.stopPropagation();
		this.move("right");
	},
	move : function(direction, byModel) {
		var $ul = this.$ul, liNum = $ul.children("li").length, $div = $ul
				.parent(), pWidth = $div.width(), $li = $ul
				.children("li:eq(0)"), liWidth = $li.width()
				+ parseInt($li.css("marginRight")), mLeft = parseInt($ul
				.css("marginLeft")), d = liWidth * liNum + mLeft - pWidth;
		if (direction == "right") {
			if (d >= liWidth) {
				if (byModel) {
					$ul.animate({
						"marginLeft" : "-=" + (d + 2)
					}, 400);
				} else {
					$ul.animate({
						"marginLeft" : "-=" + liWidth
					}, 400);
				}
			} else if (d > 0) {
				$ul.animate({
					"marginLeft" : "-=" + d
				}, 400);
			}
		} else {
			if (mLeft > -liWidth && mLeft < 0) {
				$ul.animate({
					"marginLeft" : "0px"
				}, 400);
			} else if (mLeft <= -liWidth) {
				$ul.animate({
					"marginLeft" : "+=" + liWidth
				}, 400);
			}
		}
	}
});
module.exports = new rightBottomView({
	collection : tabCollection
});
