var Backbone,$,baseBackbone;
Backbone = require('backbone');
baseBackbone = require('../base/basebackbone');
$ = Backbone.$;
paginationView=Backbone.View.extend({
	className:"page",
	template : require('../../template/pagination'),
	initialize:function(options){
		this.page={
			totalElements:0,
			totalPages:1,
			pageNo:1,
			pageSize:10
		};
		Backbone.View.prototype.initialize.call(this,options);
		this.listenTo(this.model,"query",this.query);
		this.listenTo(this.model,"page:refresh",this.refresh);
		this.render();
	},
	render:function(){
		var self=this,$el=this.$el;
		$el.append(this.template(this.setUp));
		this.addEvent();
		return this;
	},
	addEvent:function(){
		var self=this,$el=this.$el,page=this.page;
		$el.children("a").unbind("click.page");
		$el.find(".pageSize").change(function(e){
			self.page.pageSize=$(this).val();
			self.initPage();
			self.refresh();
		});
		$el.find(".first").bind("click.page",function(){
			if(page.pageNo!=1){
				page.pageNo=1;
				self.refresh();
			}
		});
		$el.find(".prev").bind("click.page",function(){
			if(page.pageNo>1){
				page.pageNo-=1;
				self.refresh();
			}
		});
		$el.find(".next").bind("click.page",function(){
			if(page.pageNo<page.totalPages){
				page.pageNo+=1;
				self.refresh();
			}
		});
		$el.find(".last").bind("click.page",function(){
			if(page.pageNo!=page.totalPages){
				page.pageNo=page.totalPages;
				self.refresh();
			}
		});
		$el.find(".certificate").bind("click.page",function(){
			var $input=$(this).prev("input");
			try{
				var val=parseInt($input.val());
				if(isNaN(val)){
					$input.val("");
					return;
				}
				$input.val(val);
				if(val<1){
					self.openAlert("请输入大于0的页码!");
				}else{
					page.pageNo=val;
					self.refresh();
				}
			}catch(e){
				$input.val("");
			}
		});
	},
	refresh:function(param){
		var self=this,page=this.page,url=self.model.get('url'),str;
		if(url.indexOf("?")>-1){
			str="&pageNo="+page.pageNo+"&pageSize="+page.pageSize;
		}else{
			str="?pageNo="+page.pageNo+"&pageSize="+page.pageSize;
		}
		if(page.attrs){
			str+="&"+page.attrs;
		}
		url+=str;
		//		this.collection.fetch({
//			url :url,
//			success : function(collection, response, options) {
//				if(collection.length == 0){
//					baseBackbone.Model.prototype.openAlert("没有数据");
//					self.initPage();
//					self.rerender();
//				}else{
//					self.setPage(response.page);
//				}	
//			},
//			error : function(collection, response, options) {
//				baseBackbone.Model.prototype.openAlert("查询错误");
//				self.initPage();
//				self.rerender();
//			},	
//			reset : true,
//		});
	},
	rerender:function(){
		var self=this,page=this.page,$el=this.$el,
			$npage=this.$el.find(".npage:eq(0)"),str="",pageStart,j=1;
		$el.find(".totalElement").text(page.totalElements);
		if(page.pageNo>1){
			$el.find(".prev").removeClass("gray");
		}else{
			var $prev=$el.find(".prev");
			if(!$prev.hasClass("gray")){
				$prev.addClass("gray");
			}
		}
		if(page.pageNo==1){
			var $first=$el.find(".first");
			if(!$first.hasClass("gray")){
				$first.addClass("gray");
			}
		}else{
			$el.find(".first").removeClass("gray");
		}
		if(page.pageNo<page.totalPages){
			$el.find(".next").removeClass("gray");
		}else{
			var $next=$el.find(".next");
			if(!$next.hasClass("gray")){
				$next.addClass("gray");
			}
		}
		if(page.pageNo==page.totalPages){
			var $last=$el.find(".last");
			if(!$last.hasClass("gray")){
				$last.addClass("gray");
			}
		}else{
			$el.find(".last").removeClass("gray");
		}
		if(page.totalPages>7&&page.pageNo>4){
			if(page.pageNo>(page.totalPages-3)){
				pageStart=page.totalPages-6;
			}else{
				pageStart=page.pageNo-3;
			}
		}else{
			pageStart=1;
		}
		for(var i=pageStart;i<=page.totalPages;i++){
			if(page.pageNo==i){
				str+='<a class="current gray">'+i+'</a>';
			}else{
				str+='<a href="#" class="gray">'+i+'</a>';
			}
			if(j==7){
				break;
			}else{
				j++;
			}
				
		}
		$npage.empty();
		$npage.append(str);
		$npage.find("a:not(.current)").click(function(e){
			self.page.pageNo=parseInt($(e.target).text());
			self.refresh();
		});
		
	},
	query:function(attrs,fixed){
		if(fixed){
			this.page.attrs=this.page.fixedAttr=attrs;
		}else{
			if(this.page.fixedAttr){
				this.page.attrs=attrs+"&"+this.page.fixedAttr;
			}else{
				this.page.attrs=attrs;
			}
		}
		this.initPage();
		this.refresh();
	},
	setPage:function(obj){
		this.page.totalPages=parseInt(obj.totalPages);
		this.page.totalElements=parseInt(obj.totalElements);
		this.rerender();
	},
	initPage:function(){
		this.page.totalElements=0;
		this.page.totalPages=1;
		this.page.pageNo=1;
	}
});
module.exports=paginationView;
