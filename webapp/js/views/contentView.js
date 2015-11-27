var Backbone,$,contentView;
Backbone = require('backbone');
$ = require('jquery');
contentView = Backbone.View.extend({
  tagName:'div',
  className:'content',	  
  initialize:function(){
    this.render();
  },
  render:function(){
	this.$el.empty();
    var LeftView = require('./leftView');
    var left = new LeftView({model:new Backbone.Model()});
    left.$el.css("height",($(window).height()-50));
	var RightView = require('./rightView');
	var right = new RightView();
	var leftFragment = document.createDocumentFragment();
	leftFragment.appendChild(left.el);
	var rightFragment = document.createDocumentFragment();
	rightFragment.appendChild(right.el);
	this.$el.append(leftFragment).append(rightFragment);
    return this;
  }
});
module.exports = contentView; 
