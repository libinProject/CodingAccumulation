### Webpack 使用

#### 1.常用命令

>| 命令                                       | 功能                |
>| ---------------------------------------- | ----------------- |
>| npm i webpack -g                         | 全局安装              |
>| npm i webpack -S                         | 本地安装              |
>| npm i webpack -D                         | 本地dev安装           |
>| webpack ./Inc/public.js  ./dist/public.min.js | webpack 解析（高版本废弃） |
>| 配置文件 + webpack                           | 结合配置文件打包          |
>| npm init -y                              | 初始化               |
>| tskill node                              | 关闭node进程，解决端口冲突问题 |

#### 2.webpack.config.js 

>在webpack.config.j文件中配置输入和输出文件
>```js
>const path=require('path')
>
>module.exports={
>	entry:path.join(__dirname,'./Inc/js/public.js'),
>	output:{
>		path:path.join(__dirname,'./dist'),
>		filename:'public.min.js'
>	}
>}
>```

#### 3. webpack-dev-server 使用

>介绍，使用该工具自动打包
>
>1.本地安装：npm i webpack-dev-server -D
>
>2.由于webpackdev-server是本地按照，所以，不可以直接命令打开，可以在package.json中配置
>
>```js
>{
>  "scripts": {
>    "dev": "webpack-dev-server --open --port 3000 --contentBase src --hot"
>  },
>  "dependencies": {
>    "jquery": "^3.3.1"
>  },
>  "devDependencies": {
>    "webpack": "^4.12.1",
>    "webpack-cli": "^3.0.8",
>    "webpack-dev-server": "^3.1.4"
>  }
>}
>```
>
>3.直接运行 npm run dev   如果有错误，自行解决相关错误
>
>4.webpack-dev-server配置第二种方式
>
>```js
>4.1 package.json中 scripts节点，增加 "dev":"webpack-dev-server"
>4.2 webpack.config.js 配置
>	
>            const path=require('path')
>            const webpack=require('webpack')
>
>            module.exports={
>                entry:path.join(__dirname,'./src/main.js'),
>                output:{
>                    path:path.join(__dirname,'./dist'),
>                    filename:'t.min.js'
>                },
>                devServer:{
>                    open:true,
>                    port:3000,
>                    contentBase:'src',
>                    hot:true
>                },
>                plugins:[
>                    new webpack.HotModuleReplacementPlugin()
>                ]
>            }
>```

#### 4.html-webpack-plugin 使用

>作用：打包生成内存html文件
>
>使用：
>
>1.npm i html-webpack-plugin -S 导包
>
>2.webpack.config.js配置项：
>
>```js
>
>const path=require('path')
>const webpack=require('webpack')
>
>const htmlwebpackplugin=require('html-webpack-plugin')
>
>module.exports={
>    entry:path.join(__dirname,'./src/main.js'),
>    output:{
>        path:path.join(__dirname,'./dist'),
>        filename:'t.min.js'
>    },
>    devServer:{
>        open:true,
>        port:3000,
>        contentBase:'src',
>        hot:true
>    },
>    plugins:[
>        new webpack.HotModuleReplacementPlugin(),
>        new htmlwebpackplugin({
>            template:path.join(__dirname,'./src/index.html'),
>            filename:'index.html'
>        })
>    ]
>}
>```

#### 5.webpack 处理样式文件

>说明：webpack 默认只能处理JS文件，如果要处理CSS，需要使用第三方loader加载器
>
>5.1 安装加载器
>
>​	npm i style-loader -D  npm i css-loader -D
>
>5.2 webpack.config.js配置文件 新增 “module”节点
>
>```js
>
>const path=require('path')
>const webpack=require('webpack')
>
>const htmlwebpackplugin=require('html-webpack-plugin')
>
>module.exports={
>    entry:path.join(__dirname,'./src/main.js'),
>    output:{
>        path:path.join(__dirname,'./dist'),
>        filename:'t.min.js'
>    },
>    devServer:{
>        open:true,
>        port:3000,
>        contentBase:'src',
>        hot:true
>    },
>    plugins:[
>        new webpack.HotModuleReplacementPlugin(),
>        new htmlwebpackplugin({
>            template:path.join(__dirname,'./src/index.html'),
>            filename:'index.html'
>        })
>    ],
>    module:{
>        rules:[
>            { test:/\.css$/,use:['style-loader','css-loader'] }
>        ]
>    }
>}
>```

#### 6.webpack 第三方相关loader

>| 文件类型  | loader                                   |
>| ----- | ---------------------------------------- |
>| css   | style-loader，css-loader                  |
>| less  | style-loader，css-loader，less-loader      |
>| sass  | style-loader，css-loader，scss-loader      |
>| 图片    | url-loader?limit=7421&name=[name].[ext]  |
>| Vue   | vue-loader，vue-template-compiler         |
>| babel | 一、babel-core, babel-loader,babel-plugin-transform-runtime |
>| babel | 二、babel-preset-env,babel-preset-stage-0  |
>

#### 7. babel webpack 安装和配置

>1. 安装俩套包：
>
>   - babel-core, babel-loader,babel-plugin-transform-runtime
>   - babel-preset-env,babel-preset-stage-0
>
>2. 增加 webpack.config.js配置
>
>   ```js
>   module:{
>           rules:[
>               { test:/.vue$/,use:'vue-loader' },
>               { test:/.css$/,use:['style-loader','css-loader']},
>               { test:/.js$/,use:'babel-loader',exclude:/node_modules/ }
>           ]
>       }
>   ```
>
>3. 项目根目录增加.babelrc文件
>
>   ```json
>   {
>       "presets": ["env", "stage-0"],
>       "plugins": ["transform-runtime"]
>   }
>   ```



