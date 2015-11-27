var Backbone, $, baseFormBackbone, Laydate;
Backbone = require('backbone');
baseFormBackbone = require("../base/baseFormBackbone");
$ = Backbone.$;
_ = require('underscore');
Laydate = require('../../lib/laydate/laydate.dev');
Date.prototype.format =function(format){
    var o = {
        "M+" : this.getMonth()+1, //month
        "d+" : this.getDate(), //day
        "h+" : this.getHours(), //hour
        "m+" : this.getMinutes(), //minute
        "s+" : this.getSeconds(), //second
        "q+" : Math.floor((this.getMonth()+3)/3), //quarter
        "S" : this.getMilliseconds() //millisecond
    }
    if(/(y+)/.test(format)) format=format.replace(RegExp.$1,(this.getFullYear()+"").substr(4- RegExp.$1.length));
    for(var k in o){
        if(new RegExp("("+ k +")").test(format)){
          format = format.replace(RegExp.$1,RegExp.$1.length==1? o[k]:("00"+ o[k]).substr((""+ o[k]).length));
        }
    }
    return format;
};
var DateTimeBoth = baseFormBackbone.View
.extend({
    tagName : 'div',
    className : 'ui-form-item ui-form-item-date-time-both',
    events : {
        "click :input:eq(0)" : "open1",
        "click :input:eq(1)" : "open2"
    },
    initialize : function() {
        DateTimeBoth.__super__.initialize.call(this);
        if (this.model.get("configer")) {
            this.config = JSON.parse(this.model.get("configer"));
        } else {
            this.config = {
                "format" : "YYYY-MM-DD hh:mm:ss",
                "istime" : "true"
            };
        }
        this.config.label = this.model.get('label');
        this.config.explain = 'error-explain'+this.model.get('id');
        this.render();
    },
    open1 : function(e) {
        var now = new Date();
        if (this.$el.find(":input:eq(1)").val()) {
            this.config.max = this.$el.find(":input:eq(1)").val();
        } else {
            this.config.start = now.format("yyyy-MM-dd hh:mm:ss");
        }
        if(this.config.beginmin && this.config.beginmin=='today'){
        	this.config.min = now.format("yyyy-MM-dd hh:mm:ss");
        }else{
        	this.config.min = '';
        }
        Laydate(this.config);
    },
    open2 : function(e) {
        var now = new Date();
        if (this.$el.find(":input:eq(0)").val()) {
            this.config.min = this.$el.find(":input:eq(0)").val();
        } else {
        	if((this.config.beginmin && this.config.beginmin=='today')
        			||(this.config.endmin && this.config.endmin=='today')){
            	this.config.min = now.format("yyyy-MM-dd hh:mm:ss");
            }else{
            	this.config.min = '';
            }
            this.config.start = now.format("yyyy-MM-dd hh:mm:ss");
        }
        this.config.max = '';
        Laydate(this.config);
    },
    renderLabel : function() {
        var self = this;
        var notNull = false;
        if (self.model.get("validators")) {
            var messages = [];
            _.each(self.model.get("validators"), function(object) {
                _.each(_.keys(object), function(k) {
                    if (k == 'NotBlank' || k == 'NotNull'
                        || k == 'NotEmpty') {
                            notNull = true;
                        }
                });
            });
        }
        if(self.model.get("flag") && self.model.get("flag")=='search'){
            notNull = false;
        }
        if(self.model.get("isDisabled") && self.model.get("isDisabled")==1){
            notNull = false;
        }
        var label = this.model.get('label') || '&nbsp;';
        if (this.$el.find('label').length === 0) {
            if(notNull){
                this.$el.prepend('<label class="ui-label"><span class="ui-form-required">*</span>' + label
                    + '：</label>');
            }else{
                this.$el.prepend('<label class="ui-label">' + label
                    + '：</label>');
            }
            return this;
        }
    },
    renderField : function() {
        var beginName = this.model.get('name');
        var endName = "";
        if (beginName.indexOf("Begin") != -1) {
            endName = beginName.replace("Begin", "End");
        } else if (beginName.indexOf("begin") != -1) {
            endName = beginName.replace("begin", "end");
        }
        var beginvalue = "", endvalue = "";
        if (this.config.oneDay && this.config.oneDay == 1) {
            beginvalue = this.dataFormat(new Date()) + " 00:00:00";
            endvalue = this.dataFormat(new Date()) + " 23:59:59";
        }
        if(this.model.get("_selectModel")){
            beginvalue = this.model.get("_selectModel").get(beginName);
            endvalue = this.model.get("_selectModel").get(endName);
        }
        if (this.model.get("flag")
            && this.model.get("flag") == 'search') {
                this.$el.find("label").after('<div class="ui-date-time-both">'
                    + '<input id="begin" type="text" name="'+ beginName+ '" value="'+ beginvalue
                    + '" class="ui-input" readonly="readonly">'
                    + '<span style="width: 6%;display: inline-block;text-align: center;">'
                    + '~' + '</span>'
                    + '<input id="end" type="text" name="'
                    + endName + '" value="' + endvalue
                    + '" class="ui-input" readonly="readonly">' + '</div>');
            } else {
                this.$el.find("label").after('<div class="ui-date-time-both">'
                    + '<input id="begin" type="text" name="'+ beginName+ '" value="'+ beginvalue+ '" class="ui-input"  readonly="readonly">'
                    + '<span style="width: 6%;display: inline-block;text-align: center;">'
                    + '~'+ '</span>'+ '<input id="end" type="text" name="'+ endName+ '" value="'
                    + endvalue+ '" class="ui-input" readonly="readonly">'
                    + '</div><p id="error-explain'+this.model.get("id")+'" class="ui-form-explain"></p>');
            }
    },
    /**
     * 备注信息
     */
    renderNote : function() {
        // var note = this.field.get('note')||'&nbsp;';
        // this.$el.find('.ui-date-time-both').first().after('<span
        // class="ui-form-other"><a href="#">'
        // +note+
        // '</a></span>');
    },
    /*******************************************************************
     * 错误信息
     ******************************************************************/
    renderExplain : function() {
        // var explain = this.field.get('explain')||'&nbsp;';
        // this.$el.find('.ui-form-other').after('<p
        // class="ui-form-explain">'+explain+'</p>');
    },
    render : function() {
        var self = this;
        this.renderLabel();
        this.renderField();
        this.renderNote();
        this.renderExplain();
        return this;
    },
    getValue:function(){
        var beginvalue = this.$el.find("#begin").val();
        var endvalue = this.$el.find("#end").val();
        var result = [];
        result.push(beginvalue);
        result.push(endvalue);
        return result;
    },
    dataFormat : function(date) {
        if (date) {
            var self = this;
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();
            if (month < 10) {
                month = "0" + month;
            }
            if (day < 10) {
                day = "0" + day;
            }
            var time = year + "-" + month + "-" + day;
        }
        self = null;
        return time;
    }
});
module.exports = DateTimeBoth;
