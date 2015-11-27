var Backbone,basebackbone,$,dialog,LoginView,Backform,Backbase,_;
basebackbone = require('../base/basebackbone');
$ = require('jquery');
dialog = require('artdialog');
Backform = require('backform');
Backbone = require('backbone');
Backbase = require('backbase');
_ = require('underscore');
require('../../lib/backformplugins/backformPlugins');
var contentView = require('./contentView');
var headView = require('./headView');
var switchAccountView = require('../dialog/switchAccountView');
LoginView = basebackbone.View.extend({
    tagName:'div',
    className:'login',
    events:{},
    initialize:function(){
	var self = this;
	this.UserModel = Backbase.MessageModel.extend({
	    url:function(){
		return '/login';
            }
	});
	$.get('../code?'+new Date().getTime(),function(date){
	    /*如果已登录，/code 链接返回null*/
	    if(date || typeof(date) == 'undefined'){
		var fragment = document.createDocumentFragment();
		fragment.appendChild(self.el);
		$('body').append(fragment);
		self.render();
		$('body').find('.maskDialog').hide();
	    }else{
		self.successLogin();
	    }
	});
    },
    render:function(){
        var user = new this.UserModel();
        var form = new Backform.Form({
            className:'ui-form ui-form-login',
            fields:[
                {label:'用户名',item:'NoRequiredInput',type:'text',
                 name:'username',id:'username',explain:'用户名',validators:['required']},
                {label:'密码',item:'NoRequiredInput',type:'password',
                 name:'password',id:'password',explain:'密码',validators:['required','min:6']},
                {label:'验证码',item:'captcha',type:'text',
                 name:'captcha',id:'captcha',explain:'请输入右图中数字。',validators:['required']},
                {item:'LoginButton'}
            ],
            model:user
        });
	form.render();
        this.$el.html(form.$el);
        this.listenTo(user,'backform:submit',function(){
            if(user.validationErrorMap){return;}
            var self = this;
            if(!self.logindialog){
                self.logindialog = dialog({});
            }
            self.logindialog.showModal();
            user.save(null,{
                success:function(model, resp,options){
                    user.unset('password');
                    user.unset('captcha');
                    $('body').append(new headView({model:model}).el).append(new contentView().el);
                    $('#left').height(document.documentElement.clientHeight-50);
                    self.logindialog.close();
                    self.remove();
                    var data = resp.accounts;
                    if(data && data.length>0){
                        var account = basebackbone.Model.extend({});
                        var accounts = basebackbone.Collection.extend({
                            model:Backbase.LoginModel
                        });
                        accounts = new accounts(data);
                        var model = basebackbone.Model.extend({accounts:accounts});
                        var switchView = new switchAccountView({
                            model:new model({accounts:accounts})
                        });
                        var d = dialog({
                            title:'切换账号',
                            content:$('<div style="height:430px;overflow:auto;width:700px;"></div>').html(switchView.el)
                        });
                        d.showModal();
                    }
                },
                error:function(error,response){
                    user.unset('password');
                    user.unset('captcha');
                    self.logindialog.close();
                    $('.yzm').attr("src","../code?"+new Date().getTime());
                }
            });
        });
        return this;
    },
    successLogin:function(){
        var self = this;
        this.undelegateEvents();
        var user = new this.UserModel({});
        user.save(null,{
            success:function(model, resp, options){
                $('body').append(new headView({model:model}).el)
                    .append(new contentView().el);
                $('#left').height($(window).height()-50);
                self.remove();
		$('body').find('.maskDialog').hide();
            },
            error:function(o1,o2,o3){
                self.delegateEvents();
            }  
        });
    }
});
module.exports = new LoginView();
