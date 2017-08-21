#!/usr/bin/env node
require('../server.babel'); // babel registration (runtime transpilation for node) 用于babel文件的注册。
var path = require('path');
// 关于__dirname  __filename   ===>http://blog.csdn.net/xixiruyiruyi/article/details/52965721
// ===>http://nodejs.cn/api/path.html#path_path_resolve_paths
// 用于获取根目录
var rootDir = path.resolve(__dirname, '..');
/**
 * Define isomorphic constants.
 */
global.__CLIENT__ = false;
global.__SERVER__ = true;
global.__DISABLE_SSR__ = false;  // <----- DISABLES SERVER SIDE RENDERING FOR ERROR DEBUGGING
global.__DEVELOPMENT__ = process.env.NODE_ENV !== 'production';

/**
 * 判断如果是开发环境，就进行node的"热加载功能"
 * ===>https://github.com/mdlawson/piping
 * @param: 
 * hook (true/false): Whether to hook into node's "require" function and only watch required files.
 * Defaults to false, which means piping will watch all the files in the folder in which main resides. 
 * The require hook can only detect files required after invoking this module
 */
if (__DEVELOPMENT__) {
  if (!require('piping')({
      hook: true,
      ignore: /(\/\.|~$|\.json|\.scss$)/i
    })) {
    return;
  }
}

// https://github.com/halt-hammerzeit/webpack-isomorphic-tools
/**
 *   webpack-isomorphic-tools : they inject that require() magic layer above the standard javascript in Node.js.
 * 此插件的作用：在node中添加require的函数机制，使得在node中不会出现引用require()而不会出现SyntaxError错误。
 *   
 * @param 
 * development(true or false, or undefined -> true)
    (Webpack plugin instance only)
    ===>判断到底是开发模式还是生产模式(默认是生产模式)。
    如果你在webpack development配置文件中实例化了webpack-isomorphic-tools/plugin，你需要调用此方法，用来开启
    热加载同时(有选择性)运行它自己的"dev server"模块。改方法需要在WebpackIsomorphicTools实例方法中的constructor
    之后里面运行。
    @param .server(projectPath, [callback])
      (server tools instance)
      在服务端初始化webpack-isomorphic-tools的实例。
      projectPath :  指定工程的基础路径(rootDir)，同时使得require()能够在服务端起作用。同时，(rootDir)必须能够
      与webpack的配置文件中context参数匹配。并且能够定位由Webpack进程输出的webpack-assets.json(包含资源信息)文件的位置。
      当首次运行项目的时候，webpack-asset.json还未生成，但由于开发环境服务器和应用服务器(node)同时启动时，应用服务器
      启动的webpack-asset.json文件尚未被Webpack产生，以至于利用require获取asset的时候，就会出现undefined的问题
      [callback]:为了解决上述问题，可以将应用服务器代码写进回调，作为第二个参数。该回调在webpack-asset.json文件一
      被察觉就会执行。
 * 
 * 
 */
var WebpackIsomorphicTools = require('webpack-isomorphic-tools');
global.webpackIsomorphicTools = new WebpackIsomorphicTools(require('../webpack/webpack-isomorphic-tools'))
  .development(__DEVELOPMENT__)
  .server(rootDir, function() {
    require('../src/server');
  });
