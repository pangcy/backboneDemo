var Backbone,_,$,ArtDialog;
Backbone = require('backbone');
_ = require('underscore');
$ = Backbone.$;
var queue = require('commoncollection').queueCollection;
var tabCollection = require('commoncollection').tabCollection;
ArtDialog= require('artdialog');
var TabOrDialog = Backbone.View.extend({
    initialize:function(){
        this.listenTo(this.model,'show',this.show);
        this.listenTo(this.model,'hide',this.hide);
        this.listenTo(this.model,'removeview',this.removeview);
        this.listenTo(this.model, 'refresh', this.refresh);
        this.sonViewArr = [];
        this.showView = new Backbone.View();
    },
    pushSonView:function(view){
        if(!this.sonViewArr){
            this.sonViewArr = [];
        }
        this.sonViewArr.push(view);
    },
    show : function() {
        this.$el.show();
    },
    hide : function() {
        this.$el.hide();
    },
    removeSonView:function(){
        if(this.sonViewArr && _.isArray(this.sonViewArr)){
            while(this.sonViewArr.length>0){
                var sonView = this.sonViewArr.pop();
                if(_.isFunction(sonView.close)){
                    sonView.close();
                }
                if(_.isFunction(sonView.remove)){
                    sonView.remove();
                }
            }
        }
    },
    removeview:function(model) {
        this.removeSonView();
        this.remove();
    },
    refresh : function() {
        var self = this;
        if (queue.last()) {
            queue.last().trigger('hide');
        }
        queue.remove(this.model,{silent:true});
        this.model.trigger('show');
        queue.push(this.model);
        this.removeSonView();
        this.$el.empty();
        if(!this.maskDialog){
            this.maskDialog = ArtDialog({});
        }
        this.maskDialog.showModal();
    }
});
module.exports = TabOrDialog;
