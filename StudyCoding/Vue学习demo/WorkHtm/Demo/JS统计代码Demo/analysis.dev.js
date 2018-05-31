var analysis = {
    getUA: function() {
        var ua = navigator.userAgent;
        if (ua.length > 250) {
            ua = ua.substring(0, 250);
        }
        return ua;
    },
    getBrower: function() {
        var ua = analysis.getUA();
        if (ua.indexOf("Maxthon") != -1) {
            return "Maxthon";
        } else if (ua.indexOf("MSIE") != -1) {
            return "MSIE";
        } else if (ua.indexOf("Firefox") != -1) {
            return "Firefox";
        } else if (ua.indexOf("Chrome") != -1) {
            return "Chrome";
        } else if (ua.indexOf("Opera") != -1) {
            return "Opera";
        } else if (ua.indexOf("Safari") != -1) {
            return "Safari";
        } else {
            return "ot";
        }
    },
    getPlatform:function(){
    	return navigator.platform;
    },
    getPageTitle:function(){
    	return document.title;
    },
    getIpAddress:function(){
    	return document.localName;
    },
    getReferreUrl:function(){
    	return document.referrer;
    },
    getUrl:function(){
    	return document.URL;
    },
    getUrlHost:function(){
    	return window.location.host;
    },
    loadDataSend:function(){
    	var ajax = new XMLHttpRequest();
        ajax.open('post','ajax_post.php');
        ajax.setRequestHeader("Content-type","application/json");
        var postData={
        	'LocalUrl':encodeURIComponent(analysis.getUrl()),
        	'UrlHost':encodeURIComponent(analysis.getUrlHost()),
        	'RefferUrl':'',
        	'IpAddress':analysis.getIpAddress(),
        	'PageTitle':analysis.getPageTitle(),
        	'Platform':analysis.getPlatform(),
        	'PageTitle':analysis.getPageTitle(),
        	'Ua':analysis.getUA(),
        	'Brower':analysis.getBrower()
        }
        ajax.send(JSON.stringify(postData));
 
        // 注册事件
        ajax.onreadystatechange = function () {
            if (ajax.readyState==4&&ajax.status==200) {
                console.log(ajax.responseText);
            }
        }
    }
}