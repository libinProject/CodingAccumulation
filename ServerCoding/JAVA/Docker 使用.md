### Docker 使用

#### 1. Docker安装

>最好使用 ubuntu  这里 使用离线安装
>
>1. 下载离线docker  文件  .deb
>2. 将文件拖到虚拟机上，用到 lrzsz  (虚拟机)
>   1. cd /root/
>   2. rz +enter 
>3. 执行命名：sudo dpkg -i  ···.deb(离线docker)
>   1. 执行 docker -v 查看版本信息
>4. ​



#### 2. Docker 入门程序

>创建三个文件 Dockerfile  requirements.txt  app.py
>
>构建docker镜像
>
>启动容器
>
>浏览器访问测试



#### 3.Docker 常用指令

>| 指令                                   | 功能             |
>| ------------------------------------ | -------------- |
>| docker images                        | 查看本地镜像         |
>| docker build -t hellodocker .        | 构建 hellodocker |
>| docker run -d -p 5000:80 hellodocker | 创建并启动容器        |
>| docker ps                            | 查看运行中的容器       |
>| docker stop +{id}                    | 结束容器           |
>| docker rmi `docker images -q `       | 删除镜像           |
>|                                      |                |
>|                                      |                |
>|                                      |                |
>
>

