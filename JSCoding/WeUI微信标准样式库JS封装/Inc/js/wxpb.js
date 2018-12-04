/*
  @param url, option 必须在调用的时候重新设置
  @descript 需要设置当前对象的url 作为公众号配置信息的接口地址 option 为分享的具体信息包括具体参数和分享后的回调
  需要主动调用当前对象的init方法
 */
var wxpb = {
    url: '',
    option: {
        title: "微软大人汇", // 分享标题
        desc: "微软大人汇", // 分享描述
        link: location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: 'http://ccg.api.socialhubplus.com/Images/smallclass/share.png', // 分享图标
        success: function () {
        },
        cancel: function () {
        }
    },
    jsApiList: ['checkJsApi',
        'chooseImage',
        'previewImage',
        'uploadImage', 'previewImage', 'updateAppMessageShareData', 'updateTimelineShareData', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'showOptionMenu', , 'hideMenuItems'],
    hideList: ["menuItem:editTag", "menuItem:delete", "menuItem:copyUrl", "menuItem:openWithQQBrowser", "menuItem:openWithSafari", "menuItem:share:email"],
    init:function() {
        var param = {
            url: escape(location.href)
        }
        $.ajax({
            url: '../WeChat/GetWxConfig',
            type: "post",
            contentType: "application/json",
            data: JSON.stringify(param),
            dataType: "json",
            async: false,
            success: function (res) {
                if (res.Status == "1") {
                    var data = res.Data
                    wx.config({
                        debug: false,
                        appId: data.appId,
                        timestamp: data.timestamp, // 生成签名的时间戳
                        nonceStr: data.noncestr, // 生成签名的随机串
                        signature: data.signature, // 签名
                        jsApiList: wxpb.jsApiList ? wxpb.jsApiList : ['updateAppMessageShareData', 'updateTimelineShareData', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'showOptionMenu']
                    });
                }
            },
            error: function () {
            }
        })
        wxpb.wxShare();
    },
    checkAndroid:function() {
        var u = navigator.userAgent;
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        if (isAndroid) {
            return 'isAndroid'
        } else if (isiOS) {
            return 'isiOS'
        }
    },
    wxShare:function() {
        wx.ready(function () {
            wx.showOptionMenu();
            wx.hideMenuItems({
                menuList: wxpb.hideList
            });
            if (wxpb.checkAndroid() == 'isiOS') {
                wx.updateAppMessageShareData(wxpb.option)
                wx.updateTimelineShareData(wxpb.option)
            }
            wx.onMenuShareAppMessage(wxpb.option)
            wx.onMenuShareTimeline(wxpb.option);
        })
    },
    error: function (s) {
        if (!this.toptips) {
            this.toptips = document.createElement('div');
            this.toptips.className = 'weui_toptips weui_warn js_tooltips';
            this.append(this.toptips);
        }
        this.toptips.innerHTML = s;
        this.toptips.style.display = 'block';
        this.errorTimer && clearTimeout(this.errorTimer);
        this.errorTimer = setTimeout(function () {
            wxpb.toptips.style.display = 'none';
        }, 3e3);
    },
    toast: function (type, status, msg) {
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
                    setTimeout(function () {
                        _toast.style.display = 'none';
                    }, 1e3);
                    break;
            };
            this._toast.style.display = 'block';
        } else {
            this._toast.style.display = 'none';
        }
    },
    confirm: function (msg, callback) {
        if (!this.dialogConfirm) {
            this.dialogConfirm = document.createElement('div');
            this.dialogConfirm.className = 'weui_dialog_confirm';
            this.dialogConfirm.innerHTML = '<div class="weui_mask"></div><div class="weui_dialog"><div class="weui_dialog_hd"><strong class="weui_dialog_title">温馨提示</strong></div><div class="weui_dialog_bd confirm-content">empty</div><div class="weui_dialog_ft"><a href="javascript:;" class="weui_btn_dialog default">取消</a><a href="javascript:;" class="weui_btn_dialog primary">确定</a></div></div>'
            this.append(this.dialogConfirm);
            this.dialogConfirm.addEventListener('click', function (e) {
                var target = e.target;
                if (target.tagName == 'A') {
                    if (target.classList.contains('primary') && callback && wxpb.checkIsType(callback, 'function')) {
                        callback();
                    }
                    wxpb.dialogConfirm.style.display = 'none';
                }
            });
        };
        this.dialogConfirm.querySelector('.confirm-content').innerHTML = msg;
        this.dialogConfirm.querySelector('.confirm-content').style.color = "#333";
        this.dialogConfirm.querySelector('.default').style.color = "#999";
        this.dialogConfirm.style.display = 'block';
    },
    alert: function (msg) {
        if (!this.dialogAlert) {
            this.dialogAlert = document.createElement('div');
            this.dialogAlert.className = 'weui_dialog_confirm';
            this.dialogAlert.innerHTML = '<div class="weui_mask"></div>\
							            <div class="weui_dialog">\
							            	<div class="weui_dialog_hd"><strong class="weui_dialog_title">温馨提示</strong></div>\
							                <div class="weui_dialog_bd alert-content">弹窗内容，告知当前状态、信息和解决方法，描述文字尽量控制在三行内</div>\
							                <div class="weui_dialog_ft">\
							                    <a href="javascript:;" class="weui_btn_dialog primary">知道了</a>\
							                </div>\
							            </div>';
            this.append(this.dialogAlert);
            this.dialogAlert.addEventListener('click', function (e) {
                var target = e.target;
                if (target.tagName == 'A') {
                    wxpb.dialogAlert.style.display = 'none';
                }
            });
        };
        this.dialogAlert.querySelector('.alert-content').innerHTML = msg;
        this.dialogAlert.querySelector('.alert-content').style.color = '#333';
        this.dialogAlert.style.display = 'block';
    },
    alertCallback: function (msg, callback) {
        if (!this.dialogAlert) {
            this.dialogAlert = document.createElement('div');
            this.dialogAlert.className = 'weui_dialog_confirm';
            this.dialogAlert.innerHTML = '<div class="weui_mask"></div>\
							            <div class="weui_dialog">\
							            	<div class="weui_dialog_hd"><strong class="weui_dialog_title">温馨提示</strong></div>\
							                <div class="weui_dialog_bd alert-content">弹窗内容，告知当前状态、信息和解决方法，描述文字尽量控制在三行内</div>\
							                <div class="weui_dialog_ft">\
							                    <a href="javascript:;" class="weui_btn_dialog primary">知道了</a>\
							                </div>\
							            </div>';
            this.append(this.dialogAlert);
            this.dialogAlert.addEventListener('click', function (e) {
                var target = e.target;
                if (target.tagName == 'A') {
                    if (callback && wxpb.checkIsType(callback, 'function')) {
                        callback();
                    }
                    wxpb.dialogAlert.style.display = 'none';
                }
            });
        };
        this.dialogAlert.querySelector('.alert-content').innerHTML = msg;
        this.dialogAlert.querySelector('.alert-content').style.color = '#333';
        this.dialogAlert.style.display = 'block';
    },
    append: function (d) {
        document.body.appendChild(d);
    },
    checkIsType: function is(o, type) {
        var isnan = { "NaN": 1, "Infinity": 1, "-Infinity": 1 }
        type = type.toLowerCase();

        if (type == "finite") {
            return !isnan["hasOwnProperty"](+o);
        }
        if (type == "array") {
            return o instanceof Array;
        }
        return (type == "null" && o === null) ||
            (type == typeof o && o !== null) ||
            (type == "object" && o === Object(o)) ||
            (type == "array" && Array.isArray && Array.isArray(o)) ||
            Object.prototype.toString.call(o).slice(8, -1).toLowerCase() == type;
    }
}
