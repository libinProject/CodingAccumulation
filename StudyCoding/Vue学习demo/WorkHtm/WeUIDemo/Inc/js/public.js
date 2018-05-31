var globleFun={
	error:function(s){
		if (!this.toptips) {
            this.toptips = document.createElement('div');
            this.toptips.className = 'weui_toptips weui_warn js_tooltips';
            this.append(this.toptips);
        }
        this.toptips.innerHTML = s;
        this.toptips.style.display = 'block';
        this.errorTimer && clearTimeout(this.errorTimer);
        this.errorTimer = setTimeout(function() {
            globleFun.toptips.style.display = 'none';
        }, 3e3);
	},
    toast: function(type, status, msg) {
        function toastContent(s) {
            return '<p class="weui_toast_content">' + s + '</p>';
        };
        var loading = '<div class="weui_loading"><div class="weui_loading_leaf weui_loading_leaf_0"></div><div class="weui_loading_leaf weui_loading_leaf_1"></div><div class="weui_loading_leaf weui_loading_leaf_2"></div><div class="weui_loading_leaf weui_loading_leaf_3"></div><div class="weui_loading_leaf weui_loading_leaf_4"></div><div class="weui_loading_leaf weui_loading_leaf_5"></div><div class="weui_loading_leaf weui_loading_leaf_6"></div><div class="weui_loading_leaf weui_loading_leaf_7"></div><div class="weui_loading_leaf weui_loading_leaf_8"></div><div class="weui_loading_leaf weui_loading_leaf_9"></div><div class="weui_loading_leaf weui_loading_leaf_10"></div><div class="weui_loading_leaf weui_loading_leaf_11"></div></div>'
        var infor = '<i class="weui_icon_toast"></i>';
        if (!this._toast) {
            this._toast = document.createElement('div');
            this._toast.innerHTML = '<div class="weui_mask_transparent"></div><div class="weui_toast"></div>';
            this.append(this._toast);
        };
        if (status) {
            var content = this._toast.querySelector('.weui_toast');
            switch (type) {
                case 'loading':
                    this._toast.className = 'weui_loading_toast';
                    content.innerHTML = loading + toastContent(msg);
                    break;
                default:
                    this._toast.className = '';
                    content.innerHTML = infor + toastContent(msg);
                    var _toast = this._toast;
                    setTimeout(function(){
                       _toast.style.display = 'none';      
                    },1e3);
                    break;
            };
            this._toast.style.display = 'block';
        } else {
            this._toast.style.display = 'none';
        }
    },
    confirm: function(msg, callback) {
        if (!this.dialogConfirm) {
            this.dialogConfirm = document.createElement('div');
            this.dialogConfirm.className = 'weui_dialog_confirm';
            this.dialogConfirm.innerHTML = '<div class="weui_mask"></div><div class="weui_dialog"><div class="weui_dialog_hd"><strong class="weui_dialog_title">温馨提示</strong></div><div class="weui_dialog_bd confirm-content">empty</div><div class="weui_dialog_ft"><a href="javascript:;" class="weui_btn_dialog default">取消</a><a href="javascript:;" class="weui_btn_dialog primary">确定</a></div></div>'
            this.append(this.dialogConfirm);
            this.dialogConfirm.addEventListener('click', function(e) {
                var target = e.target;
                if (target.tagName == 'A') {
                    if(target.classList.contains('primary') && callback && globleFun.checkIsType(callback,'function')){
                        callback();
                    }
                    globleFun.dialogConfirm.style.display = 'none';
                }
            });
        };
        this.dialogConfirm.querySelector('.confirm-content').innerHTML = msg;
        this.dialogConfirm.querySelector('.confirm-content').style.color="#333";
        this.dialogConfirm.querySelector('.default').style.color="#999";
        this.dialogConfirm.style.display = 'block';
    },
    alert:function(msg){
    	if (!this.dialogAlert) {
    		this.dialogAlert=document.createElement('div');
    		this.dialogAlert.className='weui_dialog_confirm';
    		this.dialogAlert.innerHTML=`<div class="weui_mask"></div>
							            <div class="weui_dialog">
							            	<div class="weui_dialog_hd"><strong class="weui_dialog_title">温馨提示</strong></div>
							                <div class="weui_dialog_bd alert-content">弹窗内容，告知当前状态、信息和解决方法，描述文字尽量控制在三行内</div>
							                <div class="weui_dialog_ft">
							                    <a href="javascript:;" class="weui_btn_dialog primary">知道了</a>
							                </div>
							            </div>`;
			this.append(this.dialogAlert);
			this.dialogAlert.addEventListener('click',function(e){
				var target=e.target;
				if(target.tagName=='A'){
					globleFun.dialogAlert.style.display='none';
				}
			});
    	};
    	this.dialogAlert.querySelector('.alert-content').innerHTML=msg;
    	this.dialogAlert.querySelector('.alert-content').style.color='#333';
    	this.dialogAlert.style.display='block';
    },
    append: function(d) {
        document.body.appendChild(d);
    },
    checkIsType: function is(o, type) {
  		var isnan = {"NaN": 1, "Infinity": 1, "-Infinity": 1}
			type = type.toLowerCase();

		if (type == "finite") {
		    return !isnan["hasOwnProperty"](+o);
		}
		if (type == "array") {
		    return o instanceof Array;
		}
		return  (type == "null" && o === null) ||
		       (type == typeof o && o !== null) ||
		      (type == "object" && o === Object(o)) ||
		     (type == "array" && Array.isArray && Array.isArray(o)) ||
		    Object.prototype.toString.call(o).slice(8, -1).toLowerCase() == type;
	}
}