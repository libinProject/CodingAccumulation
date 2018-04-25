var comFun={
	//ajax请求之前调用，防止重复提交
	Pople: function () {
		if(!this.popNode){
			this.popNode=document.createElement('div');
			this.popNode.style.cssText="position:absolute; width:" + window.innerWidth + "px; height:" + window.innerHeight + "px; background:#f0f0f0;opacity:0.1;filter:alpha(opacity=10);top:0; left:0;z-index:1;"
			this.append(this.popNode);
		}
		if(!this.popLoading){
			//简单loading
			// this.popLoading=document.createElement('img');
			// this.popLoading.style.cssText="display: none; position: absolute;width:16px;height:16px;";
			// this.popLoading.src='image/loading.gif';
			// this.popLoading.id='poploading'
			//另一个loading
			this.popLoading=document.createElement('div');
			var loading='<div class="loading"><span></span><span></span><span></span><span></span><span></span></div>'
			this.popLoading.innerHTML=loading;
			this.popLoading.className = 'table-loading';
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
    }
}