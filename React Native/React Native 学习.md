### React Native 学习

#### 1.环境配置

>jdk1.8
>
>node 8.0+
>
>python 2.7
>
>android sdk
>
>react native 不可以用 cnpm  所以如果用nrm 管理镜像的，需要切换至 taobao镜像
>
>安装yarn  react-native-cli工具  npm install -g yarn react-native-cli

#### 2.初始化项目

>react-native init myrn01
>
>adb devices  查看模拟器设备
>
>react-native run-android
>
>如果初始化的项目报错
>
>>```
>>Unable to resolve module `AccessibilityInfo` from
>>解决方案（0.56版本中的一个错误）：
>>react-native init AwesomeProject
>>cd AwesomeProject
>>react-native run-android
>>npm uninstall react-native
>>npm install --save react-native@0.55.4
>>react-native run-android
>>npm install --save babel-core@latest babel-loader@latest
>>npm uninstall --save babel-preset-react-native
>>npm install --save babel-preset-react-native@4.0.0
>>react-native run-android
>>```





