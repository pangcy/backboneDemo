var Backbone,$;
Backbone = require('backbone');
$ = Backbone.$;
RightView = Backbone.View.extend({
  tagName:'div',
  className:'right pt58',
  initialize:function(){ 
    this.render();
  },
  render:function(){
 	var bFragment = document.createDocumentFragment();
 	var rightB = require('./rightBottomView');
 	bFragment.appendChild(rightB.el);
    this.$el.append(bFragment);
    this.$el.append('<p class="copyright">Copyright &copy;2015 上海电银信息技术有限公司 All Rights Reserved. </p>');
    return this;
  }
});
module.exports = RightView; 
