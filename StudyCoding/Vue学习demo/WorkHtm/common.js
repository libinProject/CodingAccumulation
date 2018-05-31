'use strict';
var commonFun={
	//获取下一个兄弟元素
	getNextElement:function(element){
		if(element.nextElementSibling){
			return element.nextElementSibling;
		}else {
			var next=element.nextSibling;
			while (next&&next.nodeType!==1) {
				next=next.nextSibling;
			}
			return next;
		}
	},
	//获取上一个兄弟元素
	getPreviousElement:function(element){
		if(element.previousElementSibling){
			return element.previousElementSibling;
		}else{
			var prev=element.previousSibling;
			while (prev&&prev.nodeType!==1) {
				prev=prev.previousSibling;
			}
			return prev;
		}
	},
	//获取第一个子元素
	getFirstElement:function(element){
		if(element.firstElementChild){
			return element.firstElementChild;
		}else{
			var node=element.firstChild;
			while (node&&node.nodeType!==1) {
				node=node.nextSibling;
			}
			return node;
		}
	},
	//获取最后一个子元素
	getLastElement:function(element){
		if(element.lastElementChild){
			return element.lastElementChild;
		}else{
			var node=element.lastChild;
			while (node&&node.nodeType!==1) {
				node=node.previousSibling;
			}
			return node;
		}
	},
	//获取任意对象的内置文本
	getInnerText:function(element){
		if(typeof element.innerText ==='string'){
			return element.innerText;
		}else{
			return element.textContent;
		}
	},
	//设置任意对象的文本
	setInnerText:function(element,content){
		if(typeof element.innerText ==='string'){
			element.innerText=content;
		}else{
			element.textContent=content;
		}
	},
	//判断是否为JSON对象
    IsStrJson: function (str) {
        if (typeof str == 'string') {
            try {
                var obj = JSON.parse(str);
                if (obj && typeof obj == 'object') {
                    return true;
                } else {
                    return false;
                }
            } catch (e) {
                console.log('JSON ERR:' + str+'---'+e);
            }
        }
        console.log('str is not string');
    },
    //ajax请求之前调用，防止重复提交,依赖一个loading的image文件
	Pople: function () {
		if(!this.popNode){
			this.popNode=document.createElement('div');
			this.popNode.style.cssText="position:absolute; width:" + window.innerWidth + "px; height:" + window.innerHeight + "px; background:#f0f0f0;opacity:0.1;filter:alpha(opacity=10);top:0; left:0;z-index:1;"
			this.append(this.popNode);
		}
		if(!this.popLoading){
			this.popLoading=document.createElement('img');
			this.popLoading.style.cssText="display: none; position: absolute;width:16px;height:16px;";
			this.popLoading.src='image/loading.gif';
			this.popLoading.id='poploading'
			this.append(this.popLoading);
		}
		this.popNode.style.display = 'block';

        var obj=document.getElementById("poploading");

        var X = (window.innerWidth - obj.width) / 2;
        var Y = (window.innerHeight - obj.height) / 3;
        obj.style.left=X+'px';
        obj.style.top=Y+'px';

        //obj.style.display="block"
        this.fadein(obj,0,200);
    },
    //ajax响应里面提交
    Popce: function () {
    	if(this.popNode){
    		var obj=document.getElementById("poploading");
	        this.popNode.style.display = 'none';
	        this.fadeout(obj,20,0);
    	}

    },
    //删除元素
    RemoveElement:function(elem){
    	var parentElem = elem.parentNode;
		 if(parentElem){
		  	parentElem.removeChild(elem); 
		 }
    },
    //追加元素
    append: function(d) {
        document.body.appendChild(d);
    },
    //动画过度效果
    fadein:function(ele, opacity, speed){
    	if (ele) {  
	        var v = ele.style.filter.replace("alpha(opacity=", "").replace(")", "") || ele.style.opacity;  
	        v < 1 && (v = v * 100);  
	        var count = speed / 1000;  
	        var avg = count < 2 ? (opacity / count) : (opacity / count - 1);  
	        ele.style.display="block";
	        var timer = null;  
	        timer = setInterval(function() {  
	            if (v < opacity) {  
	                v += avg;  
	                setOpacity(ele, v);  
	            } else {  
	                clearInterval(timer);  
	            }  
	        }, 500);  
    	}
    },
    fadeout:function(ele, opacity, speed){
    	if (ele) {  
	        var v = ele.style.filter.replace("alpha(opacity=", "").replace(")", "") || ele.style.opacity || 100;  
	        v < 1 && (v = v * 100);  
	        var count = speed / 1000;  
	        var avg = (100 - opacity) / count;
	        ele.style.display="none";  
	        var timer = null;  
	        timer = setInterval(function() {  
	            if (v - avg > opacity) {  
	                v -= avg;  
	                setOpacity(ele, v);  
	            } else {  
	                clearInterval(timer);  
	            }  
	        }, 500);  
	    }
    },
    //时间格式化--padStart使用了ES6的语法
    dateFormat:function(dateStr,pattern){
    	var dt=new Date(dateStr);
    	var y=dt.getFullYear();
    	var m=(dt.getMonth()+1).toString().padStart(2,'0');
    	var d=dt.getDate().toString().padStart(2,'0');

    	if(pattern && pattern.toLowerCase()=='yyyy-mm-dd'){
    		return `${y}-${m}-${d}`
    	}else{
    		var hh=dt.getHours().toString().padStart(2,'0');
    		var mm=dt.getMinutes().toString().padStart(2,'0');
    		var ss=dt.getSeconds().toString().padStart(2,'0');
    		return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
    	}
    }
}