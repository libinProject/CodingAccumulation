### WebView常见问题汇总

#### 1. IOS 原生返回不请求ajax

>服务端获取请求的时间戳，前端页面渲染判断时间戳，如果一样，表示走的缓存
>
>
>
>>    <input type="hidden" name="SERVER_TIME" id="SERVER_TIME" value="@ViewBag.NowDt" />
>>    <script>
>>      var SERVER_TIME = document.getElementById("SERVER_TIME");
>>      var REMOTE_VER = SERVER_TIME && SERVER_TIME.value;
>>      if (REMOTE_VER) {
>>          var LOCAL_VER = sessionStorage && sessionStorage.PAGEVERSION;
>>          if (LOCAL_VER && parseInt(LOCAL_VER) >= parseInt(REMOTE_VER)) {
>>              location.reload(true);
>>          } else {
>>              sessionStorage.PAGEVERSION = REMOTE_VER;
>>          }
>>      }
>>    </script>

