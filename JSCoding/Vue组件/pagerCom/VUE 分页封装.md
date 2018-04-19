## VUE 分页封装

### 说明

> 1.该JS是基于Vue的组件式开发
>
> 2.使用前需要引用JS组件：vue.js

### 一、使用方法

#### 1.JS引用

> <script src="vue.js"></script>
> <script src="com.js"></script>

#### 2.Vue Data对象中增加分页数据对象

>pagerData:{
>
>​	page:{
>
>​		arrPageSize: [25, 50, 100],
>
>​		pagesize: 25,
>
>​		pageCount: 1,
>
>​		pageCurrent: 1,
>
>​		totalCount: 1,
>
>​		startPage: 9
>
>​	}
>
>}

#### 3.引用分页组件

>components: {
>
>​	'page-component': pager
>
>}

#### 4.页面引用组件

><page-component v-on:show-page="GetPointListData" v-bind:pager-data="pagerData"></page-component>
>
>注意：1.这边 v-on:show-page调用的是子组件触发父组件方法的事件（固定），GetPointListData是父级组件的方法，就是JS渲染数据的方法，可以自己定义
>
>​	    2.GetPointListData这个方法需要传入一个对象，分页的page对象
>
>​		参考：this.GetPointListData(this.pagerData.page);





