
/**
 * 该文件用于搭建node的web服务器，里面有相关文件配置
 * 相关连接：==>http://www.runoob.com/nodejs/nodejs-express-framework.html
 *             https://www.runoob.com/w3cnote/express-4-x-api.html
 */

import Express from 'express';
import React from 'react';
import ReactDOM from 'react-dom/server';
// 用于配置host
import config from './config';
import favicon from 'serve-favicon';
import compression from 'compression';
// node代理服务
import httpProxy from 'http-proxy';
import path from 'path';
// redux相关
import createStore from './redux/create';
// 用于自定义处理ajax
import ApiClient from './helpers/ApiClient';
import Html from './helpers/Html';
import PrettyError from 'pretty-error';
import http from 'http';
// router相关
import { match } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
// 服务端渲染相关
import { ReduxAsyncConnect, loadOnServer } from 'redux-async-connect';
import createHistory from 'react-router/lib/createMemoryHistory';
// 用于连接redux  ===》react
import {Provider} from 'react-redux';
// 获取app中定义的路由
import getRoutes from './routes';
const targetUrl = 'http://' + config.apiHost + ':' + config.apiPort;
const pretty = new PrettyError();

// 用于搭建一个node web服务   ===> http://www.runoob.com/nodejs/nodejs-express-framework.html
const app = new Express();
// http模块可以创建服务器应用实例，也能发送http请求  ===>http://blog.csdn.net/woshinannan741/article/details/51357464
/**
 * http.server是一个基于事件的HTTP服务器，{所有的请求都被封装到独立的事件当中}==>express充当事件容器，
 * 我们只需要对他的事件编写相应的行数就可以实现HTTP服务器的所有功能
 * 现在的处理方式就是将Express()当做事件容器
 */
const server = new http.Server(app);
/**
 *  httpProxy ==>用于代理websocket
  参考地址：https://www.npmjs.com/package/http-proxy
 * 支持websockets的代理库 ==>  http://www.ruanyifeng.com/blog/2017/05/websocket.html?utm_source=tuicool&utm_medium=referral
 * @param Options target: url string to be parsed with the url module
 *                 ws:    true/false, if you want to proxy websockets
 * 只有在createProxyServer生成的对象中的listen()被触发，才会构造webserver.
 * 
 */
const proxy = httpProxy.createProxyServer({
  target: targetUrl,
  ws: true
});
/**
 * app.use在express中被看成是消息中间件 middleware
 * 参考地址：http://javascript.ruanyifeng.com/nodejs/express.html
 *          https://www.runoob.com/w3cnote/express-4-x-api.html
 */
app.use(compression());
app.use(favicon(path.join(__dirname, '..', 'static', 'favicon.ico')));
/**
 * express.static(root, [options])
  express.static 是 Express 内置的唯一一个中间件，负责托管 Express 应用内的静态资源。
  root 参数指的是静态资源文件所在的根目录。
  ==>用于管理app中的静态资源
  下面的代码==>在此处指定express的存放css,js等静态资源的位置
 */
app.use(Express.static(path.join(__dirname, '..', 'static')));
// 进行接口的代理  /ws ==>支持webSocket  /api ==>一般的数据支持
// Proxy to API server
app.use('/api', (req, res) => {
  proxy.web(req, res, {target: targetUrl});
});

app.use('/ws', (req, res) => {
  proxy.web(req, res, {target: targetUrl + '/ws'});
});
// 服务器响应 upgrade 请求时触发
/**
 * 
 */
server.on('upgrade', (req, socket, head) => {
  proxy.ws(req, socket, head);
});

// added the error handling to avoid https://github.com/nodejitsu/node-http-proxy/issues/527
proxy.on('error', (error, req, res) => {
  let json;
  if (error.code !== 'ECONNRESET') {
    console.error('proxy error', error);
  }
  if (!res.headersSent) {
    res.writeHead(500, {'content-type': 'application/json'});
  }

  json = {error: 'proxy_error', reason: error.message};
  res.end(JSON.stringify(json));
});
/**
 * 进行react的服务端渲染处理
 * 
 */
app.use((req, res) => {
  if (__DEVELOPMENT__) {
    // Do not cache webpack stats: the script file would change since
    // hot module replacement is enabled in the development env
    webpackIsomorphicTools.refresh();
  }
  const client = new ApiClient(req);
  const memoryHistory = createHistory(req.originalUrl);
  const store = createStore(memoryHistory, client);
  const history = syncHistoryWithStore(memoryHistory, store);

  function hydrateOnClient() {
    res.send('<!doctype html>\n' +
      ReactDOM.renderToString(<Html assets={webpackIsomorphicTools.assets()} store={store}/>));
  }

  if (__DISABLE_SSR__) {
    hydrateOnClient();
    return;
  }

  match({ history, routes: getRoutes(store), location: req.originalUrl }, (error, redirectLocation, renderProps) => {
    if (redirectLocation) {
      res.redirect(redirectLocation.pathname + redirectLocation.search);
    } else if (error) {
      console.error('ROUTER ERROR:', pretty.render(error));
      res.status(500);
      hydrateOnClient();
    } else if (renderProps) {
      loadOnServer({...renderProps, store, helpers: {client}}).then(() => {
        const component = (
          <Provider store={store} key="provider">
            <ReduxAsyncConnect {...renderProps} />
          </Provider>
        );

        res.status(200);

        global.navigator = {userAgent: req.headers['user-agent']};

        res.send('<!doctype html>\n' +
          ReactDOM.renderToString(<Html assets={webpackIsomorphicTools.assets()} component={component} store={store}/>));
      });
    } else {
      res.status(404).send('Not found');
    }
  });
});
// 监听端口如果有用户进入页面发送请求我们输出以下语句
if (config.port) {
  server.listen(config.port, (err) => {
    if (err) {
      console.error(err);
    }
    console.info('----\n==> ✅  %s is running, talking to API server on %s.', config.app.title, config.apiPort);
    console.info('==> 💻  Open http://%s:%s in a browser to view the app.', config.host, config.port);
  });
} else {
  console.error('==>     ERROR: No PORT environment variable has been specified');
}
