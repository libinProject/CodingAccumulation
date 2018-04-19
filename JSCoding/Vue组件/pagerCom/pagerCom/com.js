var pager = {
	props: {
		pagerData:{
			type: Object,
			default:function(){
				return{
					page:{
						//分页大小
						pagesize:25,
						//分页数
						arrPageSize:[25,50,100],
						//当前页面
						pageCurrent:1,
						//总分页数
						pageCount:1,
						//总数
						totalCount:10,
						//显示的分页数
						startPage:9
					}
				}
			}
			
		}
	},

    template:'<div class="global-page-two clearfix" id="page_ul">\
    			<div class="page-filter">\
    				<span class="lable">显示条数：</span>\
    				<template v-for="item in pagerData.page.arrPageSize">\
    					<a href="javascript:void(0);" v-if="item==pagerData.page.pagesize" class="active" v-on:click="showPageSize(item,$event)">{{item}}</a>\
    					<a href="javascript:void(0);" v-on:click="showPageSize(item,$event)" v-else>{{item}}</a>\
    				</template>\
                </div>\
                <div class="page-box" id="page-box">\
                	<a href="javascript:void(0);" v-on:click="showPage(1,$event)" aria-label="more-prev">\
                        <span aria-hidden="true">&lt;&lt;</span>\
                    </a>\
                    <a href="javascript:void(0);" v-on:click="showPage(pageCurrent-1,$event)" aria-label="prev">\
                        <span aria-hidden="true">&lt;</span>\
                    </a>\
                    <template v-for="item in indexs">\
						<a href="javascript:void(0);" v-if="item==pageCurrent" v-on:click="showPage(item,$event)" class="active">{{item}}</a>\
    					<a href="javascript:void(0);" v-on:click="showPage(item,$event)" v-else>{{item}}</a>\
                    </template>\
                    <a href="javascript:void(0);" v-on:click="showPage(pageCurrent+1,$event)" aria-label="next">\
                        <span aria-hidden="true">&gt;</span>\
                    </a>\
                    <a href="javascript:void(0);" v-on:click="showPage(pagerData.page.pageCount,$event)" aria-label="more-next">\
                        <span aria-hidden="true">&gt;&gt;</span>\
                    </a>\
                </div>\
              </div>',
	//计算属性
	computed:{
		// 分页大小 获取的时候显示父级传入的，修改的时候修改自身的。子组件不能修改父元素的值
		pagesize:{
			get:function(){
				return this.pagerData.page.pagesize;
			},
			set:function(value){
				this.mypagesize = value;
			}
		},
		pageCurrent:{
			get:function(){
				return this.pagerData.page.pageCurrent;
			},
			set:function(value){
				this.mypageCurrent = value;
			}
		},
		startPage:{
			get:function(){
				return this.pagerData.page.startPage;
			},
			set:function(value){
				this.startPage = value;
			}
		},
		indexs: function () {
			console.log(this.pagerData.page.pageCurrent)
            var pager = this.pagerData.page;
            var left = 1;
            var right = pager.pageCount;
            var ar = [];
            if (pager.pageCount >= 10) {
                if (pager.pageCurrent > 5 && pager.pageCurrent < pager.pageCount - 5) {
                    left = pager.pageCurrent - 5
                    right = pager.pageCurrent + 5
                } else {
                    if (pager.pageCurrent <= 5) {
                        left = 1
                        right = 10
                    } else {
                        right = pager.pageCount
                        left = pager.pageCount - 9
                    }
                }
            }
            while (left <= right) {
                ar.push(left)
                left++
            }
            return ar
        }
	},
	methods:{
		showPage: function (pageIndex, $event) {
            if (pageIndex > 0) {
            	console.log(1)
				if(pageIndex>this.pagerData.page.pageCount) 
					pageIndex = this.pagerData.page.pageCount;
				this.$emit('show-page',{pageCurrent:pageIndex,pagesize:this.pagerData.page.pagesize});
            }
        },
        showPageSize: function (pageSize, $event) {
				this.$emit('show-page',{pageCurrent:1,pagesize:pageSize});
        }
	}
	
}