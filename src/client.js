/**
 * THIS IS THE ENTRY POINT FOR THE CLIENT, JUST LIKE server.js IS THE ENTRY POINT FOR THE SERVER.
 * @auth:alpsln  此文件是系统入口
 * note00:createStore (F)=>用于项目Store的增强
 * note01:ApiClient（C）=>用于处理Ajax
 * note02:io(C)=>用于建立Stock
 * note03:Provider(F) =>用于将redux与React进行关联
 * note04:Router(COM),browserHistory(O)=>将URL作为系统状态
 * note05:syncHistoryWithStory(F)=>将React Router 与 Redux store 绑定
 * note06:ReduxAsyncConnect （COM）=>用于数据的预加载(跟人感觉这是为了服务器加载用的)
 * 
 */
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
// 进行createStore的增强
import createStore from './redux/create';
// ApiClient（C）=>用于处理Ajax
import ApiClient from './helpers/ApiClient';
// io(C)=>用于建立Stock
import io from 'socket.io-client';
// Provider(F) =>用于将redux与React进行关联
import {Provider} from 'react-redux';
// Router(COM),browserHistory(O)=>将URL作为系统状态
import { Router, browserHistory } from 'react-router';
// syncHistoryWithStory(F)=>将React Router 与 Redux store 绑定
import { syncHistoryWithStore } from 'react-router-redux';
// ReduxAsyncConnect （COM）=>用于数据的预加载(跟人感觉这是为了服务器加载用的)
import { ReduxAsyncConnect } from 'redux-async-connect';
import useScroll from 'scroll-behavior/lib/useStandardScroll';
// 获取定义好的路由文件
import getRoutes from './routes';
/**
 * 定义项目的顶层设计
 * 1：ajax的处理方式
 * 2：Router路由的嵌入
 * 3：redux中store的增强和嵌入
 * 4：React router和Redux的绑定
 *
 */
const client = new ApiClient();
const _browserHistory = useScroll(() => browserHistory)();
const dest = document.getElementById('content');
const store = createStore(_browserHistory, client, window.__data);
const history = syncHistoryWithStore(_browserHistory, store);

function initSocket() {
  const socket = io('', {path: '/ws'});
  socket.on('news', (data) => {
    console.log(data);
    socket.emit('my other event', { my: 'data from client' });
  });
  socket.on('msg', (data) => {
    console.log(data);
  });

  return socket;
}

global.socket = initSocket();

const component = (
  <Router render={(props) =>
        <ReduxAsyncConnect {...props} helpers={{client}} filter={item => !item.deferred} />
      } history={history}>
    {getRoutes(store)}
  </Router>
);

ReactDOM.render(
  <Provider store={store} key="provider">
    {component}
  </Provider>,
  dest
);

if (process.env.NODE_ENV !== 'production') {
  window.React = React; // enable debugger

  if (!dest || !dest.firstChild || !dest.firstChild.attributes || !dest.firstChild.attributes['data-react-checksum']) {
    console.error('Server-side React render was discarded. Make sure that your initial render does not contain any client-side code.');
  }
}

if (__DEVTOOLS__ && !window.devToolsExtension) {
  const DevTools = require('./containers/DevTools/DevTools');
  ReactDOM.render(
    <Provider store={store} key="provider">
      <div>
        {component}
        <DevTools />
      </div>
    </Provider>,
    dest
  );
}
