## web-gulp
>基于Gulp构建的web开发工作流

### 特性

+ 基于`gulp+scss`构建的web项目
+ 项目图片自动压缩
+ ESLint代码检查
+ 支持生产环境打包

### Getting Started

##### 0. 开始之前，请确保已经安装node和npm，全局安装gulp-cli
```
$ npm install --global gulp-cli
```
##### 1. 下载代码
```
$ git clone https://github.com/LangWenqi/web-gulp.git
```
##### 2. 进目录，安装依赖
```
$ cd web-gulp && npm install
```
##### 3. 编译代码，生成dist目录，使用开发者工具打开dist目录
```
$ npm run dev （开发环境打包）
```

##### 4. 上传代码前编译
```
$ npm run build （生产环境打包）
```
##### 5. 上传代码，审核，发版

### 工程结构
```
web-gulp
├── dist         // 编译后目录
├── node_modules // 项目依赖
├── src 
│    ├── env        // 请求域名配置
│    ├── images     // 页面中的图片和icon
│    ├── pages      // 小程序page文件
│    ├── styles     // ui框架，公共样式
│    ├── template   // 模板
│    ├── utils      // 公共js文件
├── .gitignore
├── .eslintrc.js
├── package-lock.json
├── package.json
└── README.md

```

### Gulp说明

```
Tasks:
  dev              开发编译，同时监听文件变化
  build            整体编译
  server           启动本地服务


