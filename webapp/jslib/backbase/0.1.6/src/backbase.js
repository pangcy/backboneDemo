(function (factory) {
    // CommonJS
    if (typeof exports == "object") {
        module.exports =factory(module.exports,
            require("underscore"),
            require("backbone"),
            require("artdialog"),
            require("commoncollection")
            );
    }
    // Browser
    else
    factory(this,this._,this.Backbone,this.Dialog,this.Common);
}(function(root,_,Backbone,Dialog,Common){
    var queueCollection = Common.queueCollection;
    var tabCollection = Common.tabCollection;
    var allModelCollection = Common.allModelCollection; 
    "use strict";

    var ws = "\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003" +
    "\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028" +
    "\u2029\uFEFF";
if (!String.prototype.trim || ws.trim()) {
    ws = "[" + ws + "]";
    var trimBeginRegexp = new RegExp("^" + ws + ws + "*"),trimEndRegexp = new RegExp(ws + ws + "*$");
    String.prototype.trim = function trim() {
        if (this === undefined || this === null) {
            throw new TypeError("can't convert " + this + " to object");
        }
        return String(this).replace(trimBeginRegexp, "").replace(trimEndRegexp, "");
    };
}
var $ = Backbone.$; 
var Backbase = root.Backbase = {
    Extension:{},
    resolveNameToClass: function (name, suffix) {
        if (_.isString(name)) {
            var key = _.map(name.split('-'), function (e) {
                return e.slice(0, 1).toUpperCase() + e.slice(1);
            }).join('') + suffix;
            var klass = Backbase[key] || Backbase.Extension[key];
            if (_.isUndefined(klass)) {
                throw new ReferenceError("Class '" + key + "' not found");
            }
            return klass;
        }
        return name;
    }
};
_.extend(Backbase, Backbone.Events);
/*************************************************************
 *                        METHOND
 * ***********************************************************/
var MessageDialog = Backbase.MessageDialog = function(model,resp,options){
    var message = options.xhr|| resp;
    if(_.isFunction(message.getResponseHeader)){
    	message = message.getResponseHeader('message');
    	if(message){
	        var d = Dialog({
	            content: decodeURI(message)
	        }).show();
	        setTimeout(function () {
	            d.close().remove();
	        }, 1000);
        }
    }
}
var fetchOrSave = Backbase.fetchOrSave = function(arguments,_removeNext){
    arguments = arguments || {};
    var callSuccess = arguments.success;
    arguments.success =function(collection, resp, options){
        if(callSuccess){
            callSuccess(collection, resp, options);
        }
    }
    var callError = arguments.error;
    arguments.error =function(collection, resp, options){
        if(callError){
            callError(collection, resp, options);
        }
        switch (resp.status) {
            //401 没有权限，登录超时
        case 401:
            var loginModel = allModelCollection.get(1);
            loginModel.set({_removeNext:_removeNext});
            tabCollection.add(loginModel);
            break;
        case 404:
            var d = Dialog({
                content:'没有资源'
            }).show();
            setTimeout(function () {
                d.close().remove();
            }, 2000);
            break;
        default:
            break;
        }
    }
}
/***************************************************************
 *                         VIEW
 * *************************************************************/
var BaseView = Backbase.BaseView = Backbone.View.extend({});
/**************************************************************/
/***************************************************************
 *                         MODEL
 * *************************************************************/
var BaseModel = Backbase.BaseModel = Backbone.Model.extend({
    initialize:function(){
        this.listenTo(this,'sync',this.baseSync);
        this.listenTo(this,'error',this.baseError);
        this.listenTo(this,'request',this.baseRequest);
    },
    baseSync:function(model,resp,options){},
    baseError:function(model,resp,options){},
    baseRequest:function(model, xhr, options){} 
});
var MessageModel = Backbase.MessageModel = BaseModel.extend({
    baseSync:function(model,resp,options){
        Backbase.resolveNameToClass('message','Dialog')(model,resp,options);
    },
    baseError:function(model,resp,options){
        Backbase.resolveNameToClass('message','Dialog')(model,resp,options);
    }
});
var LoginModel = Backbase.LoginModel = MessageModel.extend({
	save:function(){
		Backbase.fetchOrSave(arguments[1],false);
		LoginModel.__super__.save.apply(this,arguments);
	},
    fetch:function(){
        Backbase.fetchOrSave(arguments[0],false);
		LoginModel.__super__.fetch.apply(this,arguments);
    }
});
/*******************************************************************/

/******************************************************************
 *                      COLLECTION
 * *****************************************************************/
var BaseCollection = Backbase.BaseCollection = Backbone.Collection.extend({
    initialize:function(){
        this.listenTo(this,'sync',this.baseSync);
        this.listenTo(this,'error',this.baseError);
        this.listenTo(this,'request',this.baseRequest);
    },
    baseSync:function(collection,resp,options){},
    baseError:function(collection,resp,options){},
    baseRequest:function(collection,resp,options){}
});
var MessageCollection = Backbase.MessageCollection = BaseCollection.extend({
    baseSync:function(collection,resp,options){
        Backbase.resolveNameToClass('message','Dialog')(collection,resp,options);
    },
    baseError:function(collection,resp,options){
        Backbase.resolveNameToClass('message','Dialog')(collection,resp,options);
    }
});
var LoginMessageCollection = Backbase.LoginMessageCollection = MessageCollection.extend({
    fetch:function(){
    	Backbase.fetchOrSave(arguments[0],this._removeNext);
        LoginMessageCollection.__super__.fetch.apply(this,arguments);
    }
});
var LoginCollection = Backbase.LoginCollection = LoginMessageCollection.extend({
    _removeNext:true
});
/*********************************************************************/
return Backbase;
}));
