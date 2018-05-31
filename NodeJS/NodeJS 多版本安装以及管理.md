### NodeJS 多版本安装以及管理

> 主要介绍nvm(node version management) 管理node多版本
>
> ​	1.node安装及配置
>
> ​	2.nvm常用命令

#### 1.nvm 安装步骤

>1.下载nvm压缩包：[nvm下载地址](https://github.com/coreybutler/nvm-windows/releases)
>
>2.在D盘新建node文件夹，node文件夹下面创建nvm，nodejs文件夹
>
>3.将下载的nvm解压至 nvm 文件夹中
>
>4.执行 install.cmd（以管理员身份运行） 生成setting.txt保存到当前文件夹
>
>5.修改setting.txt文件内容：
>
>​	root:  D:\Soft\Node\nvm        ------创建的nvm目录
>
>​	path:  D:\Soft\Node\nodejs        ------创建的nodejs目录

#### 2.nvm 环境变量

>系统变量中增加如下配置：
>
>​	NVM_HOME :              D:\Soft\Node\nvm
>
>​	NVM_SYMLINK :          D:\Soft\Node\nodejs
>
>​	PATH:                     %NVM_HOME%;%NVM_SYMLINK%

#### 3.nvm 常用命令

>| 命令                      | 功能             |
>| ----------------------- | -------------- |
>| nvm version             | 查看nvm版本        |
>| nvm list                | 查看安装过nodejs 版本 |
>| nvm install <version>   | 安装nodejs对应版本   |
>| nvm use <version>       | 选择使用nodejs版本   |
>| node -v                 | 查看node版本       |
>| nvm uninstall <version> | 卸载对应版本的nodejs  |



