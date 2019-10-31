# Terminal-ui

自助服务终端客户端静态页面。使用ant-design-vue开发，编译打包后复制在终端的程序包中，随程序包一同发布升级。

## 环境

* node --运行/编译环境
* npm --依赖管理
* vue/cli --vue官方脚手架
* eslint --代码规范
* less --css预处理

## 依赖

* vue --渐进式Javascript框架
* vuex --状态管理模式
* vue-router --路由管理器
* vue-ls --本地/会话/内存存储
* vuejs-logger --日志记录工具
* ant-design-vue --蚂蚁金服的前端/设计解决方案
* axios --基于promise的HTTP库
* nprogress --纳米级进度条
* mockjs --生成随机数据，拦截Ajax请求

## 环境准备

1. 安装node.js

> 在node.js官网下载最新稳定版安装即可。[Node.js官网](http://nodejs.cn/)

在命令终端中测试是否安装成功

```
node -v
npm -v
```

2. 使用淘宝代理

```
npm config set registry https://r.npm.taobao.org/
```

3. 安装vue脚手架

```
npm install -g @vue/cli
```

## 安装

克隆项目到本地

```
git clone https://github.com/NanShengForMe/terminal-ui.git
```

安装依赖

```
npm install
```

如果安装依赖报错, 则删除`node_modules`目录和`package-lock.json`后重新运行`npm install`命令

## 运行

```
npm run serve
```

## 编辑器推荐

推荐使用微软出品的免费编辑器：Visual Studio Code。[VS Code](https://code.visualstudio.com/)

### 推荐安装插件

* Vetur
* ESLint
* Ant Design Vue Debugger

## 目录结构

```
.
├── README.md --自述文件
├── babel.config.js --Javascript编译器
├── node_modules --依赖文件
├── package-lock.json --依赖文件版本锁定
├── package.json --依赖管理, 及相关配置集成
├── public --发布文件夹(不会编译)
│   ├── favicon.ico --网站图标
│   └── index.html --入口页面
├── src --源码目录(会编译)
│   ├── App.vue --入口页面
│   ├── api --向后端请求的接口
│   │   ├── app.js --应用接口
│   │   ├── magnet.js --功能磁贴接口
│   │   └── user.js --用户功能接口
│   ├── assets --资源文件夹
│   │   ├── images --图片文件夹
│   │   │   ├── bg.png
│   │   │   ├── card.png
│   │   │   ├── equipment.png
│   │   │   ├── furniture.png
│   │   │   ├── icon-01.png
│   │   │   ├── icon-02.png
│   │   │   ├── icon-03.png
│   │   │   ├── icon-04.png
│   │   │   ├── logo.png
│   │   │   ├── tip.png
│   │   │   ├── two.png
│   │   │   ├── user.png
│   │   │   └── weixin.png
│   │   └── logo.png --首页logo
│   ├── components --公用组件
│   │   ├── GlobarHeader.vue --公共页头
│   │   ├── Index --首页相关
│   │   │   └── ProductEntry.vue --产品入口组件
│   │   ├── Magnet --功能磁贴页相关
│   │   │   └── MagnetItem.vue --功能磁贴组件
│   │   └── tools --其他工具组件
│   │       └── Spin.vue --加载中组件
│   ├── core --基础文件夹
│   │   ├── index.js --默认输出文件
│   │   └── modules --需要输出的模块
│   │       ├── antDesign.js --antd按需引入
│   │       ├── premission.js --授权控制
│   │       ├── vueLogger.js --日志接口
│   │       └── vueLs.js --本地/会话/内存存储
│   ├── main.js --函数主入口
│   ├── mock --拦截Ajax请求, 模拟返回数据
│   │   ├── index.js --默认输出文件
│   │   └── modules --需要输出的模块
│   │       ├── app.js --应用程序相关
│   │       ├── magnet.js --功能磁贴页相关
│   │       └── user.js --用户功能相关
│   ├── router --路由控制器
│   │   └── index.js --默认输出文件
│   ├── store --状态管理模式
│   │   ├── index.js --默认输出文件
│   │   └── modules --需要输出的模块
│   │       ├── app.js --应用程序相关
│   │       ├── magnet.js --功能磁贴相关
│   │       └── user.js --用户功能相关
│   ├── styles --样式文件夹
│   │   ├── index.less --默认输出文件
│   │   └── modules --需要输出的文件夹
│   │       ├── animation.less --动画样式
│   │       ├── common.less --公共样式
│   │       └── global.less --全局样式
│   ├── utils --工具包
│   │   └── request.js --axios的简单封装
│   └── views --页面/视图
│       ├── Home.vue --用户首页
│       ├── Index.vue --系统切换页
│       ├── Login.vue --登录页
│       └── Magnet.vue --功能磁贴页
└── vue.config.js --vue配置文件
```
