var Backbone,$;
Backbone = require('backbone');
$ = require('jquery');
var queue = require('commoncollection').queueCollection;
var tabCollection = require('commoncollection').tabCollection;
var tabView = Backbone.View.extend({
    tagName:'li',
    className:'ui-switchable-trigger ui-switchable-active',
    events:{
       'click .closeBtn':'close',
       'click':'tab'
    },
    initialize:function(){
        this.render();
        this.listenTo(this.model,'show',this.show);
        this.listenTo(this.model,'hide',this.hide);
        this.listenTo(this.model,'removeview',this.removeview);
    },
    render:function(){
        this.$el.append('<span>'+this.model.get('moduleName')+'</span>');
        if(!this.model.noClose){
	    this.$el.append('<span class="close"><i style="cursor:pointer;" class="iconfont closeBtn">&#xF045;</i></span>');
        }
        return this;
    },
    removeview:function(model){
      this.$el.hide('slow');
      this.remove(); 
    },
    show:function(){
        this.$el.addClass('ui-switchable-active');
    },
    hide:function(){
        this.$el.removeClass('ui-switchable-active');
    },
    close:function(e){
        e.stopPropagation();
        var target = $(e.currentTarget);
        tabCollection.remove(this.model);
    },
    tab:function(e){
        e.stopPropagation();
        var target = $(e.currentTarget);
        if(queue.last()){
            queue.last().trigger('hide');
        }
        queue.remove(this.model);
        this.model.trigger('show');
        queue.push(this.model);
    }
});
module.exports = tabView; 

