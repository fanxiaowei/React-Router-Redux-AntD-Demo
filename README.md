# React-Router-Redux-AntD-Demo
React Router Redux AntDesign
# 基于国外大神的react框架进行国内本地化处理
```
此版本是1.0版，是将最原始的版本进行本地化处理，将UI控件替换为Ant Design。同时，添加了一些 ***奇技淫巧***。大部分都是在开发中遇到的关于react的坑。这个只是一个*呆板*的代码的copy。此后，该版本会有较大的升级。(此版本会一直保留)
此后的版本，还是会基于1.0版本的框架进行扩展，并依次加入如下技术。
前端技术栈
router的按需加载
facebook的immuable库
权限控制(不同于1.0版本的根据router的钩子，利用后台控制)
采用fetch进行数据的请求
兼容IE9
采用自定义组件实现较为复杂的功能
采用RN技术来实现移动开发
后台技术栈（1.0版本暂时不添加）
后台采用SSM框架
利用Spring Cloud搭建微服务
```
-------------
此版本的一些模块布局在2.0版本会有很大的改动，会按着模块进行页面的划分。
## 关于1.0框架所用的技术栈


* ~~Isomorphic~~ [Universal](https://medium.com/@mjackson/universal-javascript-4761051b7ae9) rendering
* Both client and server make calls to load data from separate API server
* [React](https://github.com/facebook/react)
* [React Router](https://github.com/rackt/react-router)
* [Express](http://expressjs.com)
* [Babel](http://babeljs.io) for ES6 and ES7 magic
* [Webpack](http://webpack.github.io) for bundling
* [Webpack Dev Middleware](http://webpack.github.io/docs/webpack-dev-middleware.html)
* [Webpack Hot Middleware](https://github.com/glenjamin/webpack-hot-middleware)
* [Redux](https://github.com/rackt/redux)'s futuristic [Flux](https://facebook.github.io/react/blog/2014/05/06/flux.html) implementation
* [Redux Dev Tools](https://github.com/gaearon/redux-devtools) for next generation DX (developer experience). Watch [Dan Abramov's talk](https://www.youtube.com/watch?v=xsSnOQynTHs).
* [React Router Redux](https://github.com/reactjs/react-router-redux) Redux/React Router bindings.
* [ESLint](http://eslint.org) to maintain a consistent code style
* [redux-form](https://github.com/erikras/redux-form) to manage form state in Redux
* [lru-memoize](https://github.com/erikras/lru-memoize) to speed up form validation
* [multireducer](https://github.com/erikras/multireducer) to combine single reducers into one key-based reducer
* [style-loader](https://github.com/webpack/style-loader), [sass-loader](https://github.com/jtangelder/sass-loader) and [less-loader](https://github.com/webpack/less-loader) to allow import of stylesheets in plain css, sass and less,
* [bootstrap-sass-loader](https://github.com/shakacode/bootstrap-sass-loader) and [font-awesome-webpack](https://github.com/gowravshekar/font-awesome-webpack) to customize Bootstrap and FontAwesome
* [react-helmet](https://github.com/nfl/react-helmet) to manage title and meta tag information on both server and client
* [webpack-isomorphic-tools](https://github.com/halt-hammerzeit/webpack-isomorphic-tools) to allow require() work for statics both on client and server
* [mocha](https://mochajs.org/) to allow writing unit tests for the project.


## 框架的安装

```bash
npm install
```

## 运行DEV环境

```bash
npm run dev
```
## 编辑同时运行生成环境

```bash
npm run build
npm run start
```


