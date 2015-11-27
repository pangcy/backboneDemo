var Backbone, _;
Backbone = require('backbone');
_ = require('underscore');
var cellModel = Backbone.Model.extend({
	initialize : function() {
		var self = this;
		this.listenTo(this, "sync", function(model, resp, options) {
			_.each(model.keys(), function(key) {
				self.trigger("change:" + key);
			});
		});
		this.listenTo(this, "backgrid:selected", function(model, checked) {
			model.set({
				"selected" : checked
			}, {
				silent : true
			});
		});
	},
//	url : function() {
//		return this.get('_links').self.href;
//	}
});
var TrCollection = Backbone.Collection.extend({
	_removeNext : false,
	parse : function(response) {
		if (response && response) {
			var list = _.map(response, function(val) {
				var reVal = val;
				var val0 = val[0];
				if (_.keys(val0).length === 2) {
					reVal = _.map(val, function(v) {
						var v0 = _.map(v, function(num, key) {
							if (key !== '_links') {
								return num;
							}
						})[0];
						v0._links = v._links;
						return v0;
					})
				}
				return reVal;
			});
			return list[0];
		}else{
			return [];
		}
	},
	model : cellModel
});
module.exports = TrCollection;
