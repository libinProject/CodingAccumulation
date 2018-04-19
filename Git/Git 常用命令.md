## Git 常用命令

#### 1.初始化Git仓库

> git init

#### 2.机器配置用户信息

> git config --global user.name "lb"
>
> git config --global user.email  "lb@123.com"

#### 3.代码存储到本地git仓库

> git add ./index.html        or       git add ./
>
> git commit -m "日志说明"    git commit --all -m "日志说明"

#### 4.代码上传GitHub

>git push [git地址] master
>
>or
>
>git remote add origin [git地址]
>
>git push origin master

#### 5.获取GitHub源代码

> git init
>
> git pull [git地址] master 

#### 6.克隆源代码

> git clone [git 地址] master

#### 7.查看代码状态

> git status

#### 8.查看日志

> git log --oneline

#### 9.回退操作

>git reset --hard Head 0
>
>git reset --hard [版本号]

#### 10.分支操作

>git branch dev            创建分支
>
>git branch                   查看分支
>
>git checkout dev        切换分支
>
>git merge dev             合并分支
>
>git branch -d dev        删除分支

#### 11.生产SSH密钥

> ssh-keygen -t rsa -C "lb@123.com"
>
> 将生成完的密钥放在github设置里面，成员便可根据SSH的方式迁出代码

