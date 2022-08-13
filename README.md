# **163MusicTools**
网易云音乐 一键签到 打卡 300首歌 小工具  

菜鸡coder的express+vue3入门demo

助力每个云村村民的v10梦

<p>觉得好用就帮忙点颗免费的 star 吧,您的鼓励将是我继续前进的动力<br><br>
<a href="https://github.com/zakiaatot/163MusicTools"><img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/zakiaatot/163MusicTools?style=social"></a></p>


<p>
<a href="https://www.npmjs.com/package/163musictools"><img alt="npm" src="https://img.shields.io/npm/v/163musictools?style=flat"></a>
<a href="https://github.com/Zakiaatot/163musictools"><img alt="GitHub package.json version (subfolder of monorepo)" src="https://img.shields.io/github/package-json/v/zakiaatot/163musictools"></a>
</p>


## **一、灵感来源**


## [Binaryify/NeteaseCloudMusicApi](https://github.com/Binaryify/NeteaseCloudMusicApi)


## **二、展示及技术栈**
[部署的Demo地址](http://124.71.23.192:9001/) 




简单的交互UI，使用 [Element-plus](https://github.com/element-plus/element-plus),由于是SPA，故采用直接引入式Vue，更多细节请看  [Demo地址](http://124.71.23.192:9001/),总体来讲 nodejs+express+vue3+elementplus

登录页:
![登录页](http://124.71.23.192:9001/img/login.png)

首页:
![首页](http://124.71.23.192:9001/img/index.png)

打卡:
![打卡](http://124.71.23.192:9001/img/daka.png)



## **三、使用前须知**

`1.不要经常登录，登出容易账号异常`


`2.刷的歌会不会影响我的大数据推荐?`

`理论上不会，因为刷的歌是从你的推荐歌单筛选出来的`

`3.打卡明明显示听了350首歌但是听歌量只加了一点点？`

`因为刷的歌里有你以前听过的歌，不算入听歌量，建议一天点打卡2-3次即可，多了容易账号异常`



## **四、使用**



### **1.安装**

**github:**

```shell
$ git clone https://github.com/Zakiaatot/163musictools
$ cd 163musictools
$ npm install
```
或者

```shell
$ git clone git@github.com:Zakiaatot/163musictools.git
$ cd 163musictools
$ npm install
```

**npm:**
```shell
$ npm i 163musictools
```


### **2.运行**

```shell
$ npm run start
```
接下来访问


http://localhost:9001


即可愉快的打卡了
默认`9001`端口
需要更改请至`app.js`中更改


若是开发者调试推荐使用`nodemon`
```shell
$ npm i nodemon
$ npm run dev
```

## **五、部署**
略

鄙人采用宝塔可一键部署node项目

实际上是个前后端分离项目，只是为了方便调试才一起写在express里了，如有需求请自行分离部署

### **`建议:`**
打卡对服务器的延迟要求挺高的，建议是内地服务器，如没需求建议本地运行



## **六、免责声明**

所有资源及想法均来自网上的开源项目,鄙人只不过是做了个整合，由此项目产生的所有纠纷与本人无关

## **七、后续展望**

本人只是个小小技术菜鸟，但有着肯学习的精神，虽说现在的代码可能是一堆屎山，我愿意不断改进，欢迎你们的issue

对本项目我的后期展望是：


    1.丰富更多功能，如云贝签到，刷单首歌的播放次数
    2.不断优化改进我的前端界面
    3.后端也不断优化，提高执行效率
    4.下一步应该是托管任务系统，一个每日自动打卡并且提醒成功与否的功能平台。。。。。