var _,$,Backbone;
Backbone=require("backbone");
$ = require('jquery');
_ = require('underscore');
var dialog = require('artdialog');
var FormView = Backbone.View.extend({
    tagName:'form',
    className : 'ui-form ui-form-search', 
    events:{
        'click #clean':'clean',
    },
    initialize:function(options){
    	this.listenTo(this.model,"clean",this.clean);
        this.render();
        this.flag = 'hide';
    },
    render:function(){
        var self = this;
        self.collection.each(function(s){
            s.set({"flag":"search"});
            var item = null;
            if(s.get('type')=='text'){
            	item = self.createText(s)
            }else if(s.get('type')=='select'){
            	item = self.createSelect(s)
            }else if(s.get('type')=='dateTimeBoth'){
            	item = self.createDateTimeBoth(s)
           }else if(s.get('type')=='searchtextView'){
        	    item = self.createSearchtextView(s)
           }
        	self.$el.append(item.el);
        });
        self.$el.append('<div class="ui-form-item fn-right buttonAuto" ><input type="submit" class="ui-button ui-button-mblue" value="查询"><input type="button" id="clean" class="ui-button ui-button-mshdywhite" value="重置"></div>');
        self.$el.wrapInner('<fieldset></fieldset>');
        this.$el.submit(function(e){
            e.preventDefault();
            self.model.trigger("query",self.$el.serialize());
        });
        return this;
    },
    clean:function(){
        this.$el.find(':input')
            .not(':button, :submit, :reset, :hidden')  
            .val('')  
            .removeAttr('checked')  
            .removeAttr('selected');  
    },
    createDateTimeBoth:function(e){
        var dateTimeBoth = require('./dateTimeBoth');
        return new dateTimeBoth({model:e});
    },
    createText:function(e){
        var textView = require('./textView');
         return new textView({model:e});
    },
    createSelect:function(e){
        var selectView = require('./selectView');
        return new selectView({model:e});
    },
    createSearchtextView:function(e){
    	var searchtextView = require('./searchtextView');
    	return new searchtextView({model:e});
    }
});
module.exports = FormView;
