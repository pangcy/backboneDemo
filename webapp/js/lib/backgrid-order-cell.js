(function (root, factory) {

  // CommonJS
  if (typeof exports == "object") {
    module.exports = factory(require("backbone"), require("backgrid"));
  }
  // Browser
  else factory(root.Backbone, root.Backgrid);

}(this, function (Backbone, Backgrid) {

  "use strict";
  var OrderCell = Backgrid.Extension.OrderCell = Backgrid.Cell.extend({
	  initialize:function(options){
		  Backgrid.Cell.prototype.initialize.call(this,options);
	  },
	  render:function(){
		  this.$el.empty();
		  var model=this.model;
		  var collection=model.collection.models;
		  for(var i=0,l=collection.length;i<l;i++){
			  if(collection[i].cid==model.cid){
				  break;
			  }
		  }
		  this.$el.text(i+1);
		  this.delegateEvents();
		  return this;
	  }
  });
}));
