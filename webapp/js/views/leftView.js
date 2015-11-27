var Backbone,$,_;
Backbone = require('backbone');
$ = Backbone.$;
_ = require('underscore');
var tabCollection = require('commoncollection').tabCollection;
var aView = Backbone.View.extend({
    tagName:'li',
    events:{
        'click':'open'
    },
    initialize:function(){
        this.render();
    },
    render:function(){
        this.$el.html('<a href="'+this.model.get('url')+'">'+this.model.get('moduleName')+'</a>');
        return this;
    },
    open:function(e){
        e.stopPropagation();
        if(tabCollection.get(this.model.id)){
            tabCollection.get(this.model.id).trigger('refresh');
        }else{
            tabCollection.add(this.model);
        }
        return false;
    }
});
var LeftView = Backbone.View.extend({
    tagName:'div',
    className:'left',
    id:'left',
    events:{
        "click .subNav":"subNav",				
        "click .subNav2":"subNav2"				
    },				
    subNav:function(e){
        e.stopPropagation();	
        var target = $(e.currentTarget);
        target.toggleClass("currentDd").siblings(".subNav").removeClass("currentDd");
        target.toggleClass("currentDt").siblings(".subNav").removeClass("currentDt");
        // 修改数字控制速度， slideUp(500)控制卷起速度
        target.next(".navContent").slideToggle(500).siblings(".navContent").slideUp(500);
        return false;
    },			
    subNav2:function(e){
        e.stopPropagation();	
        var target = $(e.currentTarget);
        target.toggleClass("currentDd2").siblings(".subNav2").removeClass("currentDd2");
        target.toggleClass("currentDt2").siblings(".subNav2").removeClass("currentDt2");
        // 修改数字控制速度， slideUp(500)控制卷起速度
        target.next(".navContent2").slideToggle(500).siblings(".navContent2").slideUp(500);
        return false;
    },					
    initialize:function(){
    	$('body').find('.maskDialog').hide();
    	this.menus = [{id:1,moduleName: "供应商管理",childrenList: [
    	            {id:2,moduleName: "供应商接口修改",url:""}]},
    	            {id:3,moduleName: "产品管理",url:"",childrenList: [
    	            {id:4,moduleName: "产品查询",url:""},{id:5,moduleName: "产品修改",url:""}]}
    	            ]
        this.render();
    },
    render:function(){
        /****
         * 根节点加入allModelCollection
         * **/
        var subNavBox = $('<div class="subNavBox"></div>');
        _.each(this.menus,function(moduleSec){
            var img = moduleSec.img;	  
            if (img === undefined){
                img = '';
            }
            var subNav = $('<div class="subNav">'
                +'<span>'
                + moduleSec.moduleName
                +'</span>'
                +'</div>');
            var ul = $('<ul class="navContent"></ul>');
            _.each(moduleSec.childrenList,function(moduleThr){
                if(moduleThr.childrenList&& moduleThr.childrenList.length > 0){
                    ul.append($('<li><a class="subNav2">'+moduleThr.get('moduleName')+'</a></li>'));
                    var ul2 = $('<ul class="navContent2"></ul>');
                    _.each(moduleThr.childrenList,function(moduleFou){
                        var a = new aView({model:new Backbone.Model(moduleFou)});
                        ul2.append(a.$el);
                    });
                    ul.children('li').append(ul2);
                }else{
                    var a = new aView({model:new Backbone.Model(moduleThr)});
                    ul.append(a.$el);
                }
            });
            subNavBox.append(subNav).append(ul);
        });
        this.$el.html(subNavBox);
        return this;
    }
});
module.exports = LeftView; 
