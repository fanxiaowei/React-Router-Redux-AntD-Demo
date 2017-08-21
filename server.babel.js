//  enable runtime transpilation to use ES6/7 in node
// 用于加载babelrc中对用的配置项 react、ES6、ES7   antd的样式等
var fs = require('fs');
// node的同步加载文件，(需要文件加载之后，才会进行后续的操作)
//   "babelrc相关连接":["http://www.ruanyifeng.com/blog/2016/01/babel.html"],(由于babelrc中有特殊的格式处理，所有只能讲关于他的连接贴在这里)
var babelrc = fs.readFileSync('./.babelrc');
var config;

try {
  config = JSON.parse(babelrc);
} catch (err) {
  console.error('==>     ERROR: Error parsing your .babelrc.');
  console.error(err);
}
// 需要注意的是，babel-register只会对require命令加载的文件转码，而不会对当前文件转码。另外，由于它是实时转码，所以只适合在开发环境使用。
require('babel-register')(config);
