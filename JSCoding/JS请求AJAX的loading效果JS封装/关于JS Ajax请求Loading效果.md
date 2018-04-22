### 关于JS Ajax请求Loading效果

### 1.问题说明

> JS在请求服务端接口的时候，可能会因为网络原因或者接口响应慢，导致重复提交
>
> 我们给ajax请求加上loading效果
>
> 该方法基于原生JS写的，不依赖JS插件库

### 2.使用说明

>1.引用public.js，因为loading效果需要一张loading图片，图片可以自行换
>
>2.ajax请求前，调用方法：comFun.Pople();
>
>3.ajax请求完成，调用方法：comFun.Popce();