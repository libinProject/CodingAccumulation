# WeUI 操作反馈 JS封装

### 说明

> 1.该JS基于WeUI封装，适用于微信移动端样式，属于微信的标准化样式
>
> 2.使用前需要引用微信的CDN CSS：https://res.wx.qq.com/open/libs/weui/0.4.3/weui.min.css
>
> 3.引用公共JS Public.js



### 一、操作反馈具体调用方法

##### 1.Toast(加载中)

> 调用方法：globleFun.toast(type,status,msg)
>
> 调用示例：globleFun.toast('loading',1,'加载中')
>
> 参数说明：
>
> | 参数名称   | 参数值           | 参数说明                      |
> | ------ | ------------- | ------------------------- |
> | type   | loading，toast | loading:加载中样式  toast:普通吐司 |
> | status | 0，1           | 0：隐藏   1：显示               |
> | msg    | '加载中'         | 吐司提示语                     |



##### 2.Error 系统错误提示警告

>调用方法：globleFun.error(msg)
>
>调用示例：globleFun.error('system error')
>
>参数说明：
>
>| 参数名称 | 参数值          | 参数说明     |
>| ---- | ------------ | -------- |
>| msg  | system error | 系统错误提示信息 |



##### 3.Confirm 对话框

> 调用方法：globleFun.confirm(msg,callback)
>
> 调用示例：globleFun.confirm('确定取消吗？',function(){console.log(1)})
>
> 参数说明：
>
> | 参数名称     | 参数值      | 参数说明        |
> | -------- | -------- | ----------- |
> | msg      | 确定取消吗？   | confirm 提示语 |
> | callback | function | 点击【确定】的回掉函数 |



##### 4.Alert 对话框

> 调用方法：globleFun.alert(msg)
>
> 调用示例：globleFun.alert('简单提示框')
>
> 参数说明：
>
> | 参数名称 | 参数值  | 参数说明      |
> | ---- | ---- | --------- |
> | msg  | 提示语  | alert 提示语 |



