/**
 * @auth:alpsln
 * description:用于项目Redux的Store的增强
 * note01:createStore/applyMiddleware/compose =>引入redux中处理store的原生方法
 * note02:createMiddleware(F)=>用户自己定义的中间件集合
 * note03:routerMiddleware(F)=>用redux的方式改变Router(利用dispath来进行路由的交互等)
 * note04：thunk=>redux进行异步交互的中间件
 * note05:Immuable (MODEL)=>不可变量，进行项目的数据优化
 */
import { createStore as _createStore, applyMiddleware, compose } from 'redux';
import createMiddleware from './middleware/clientMiddleware';
import { routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk';
import Immutable from 'immutable';
/**
 * 
 * @param {*react-router中的browerHistory} history 
 * @param {*ApiCient用户定义的ajax的处理方式，利用superagent} client 
 * @param {*Window.__data,用于获取窗口数据} data 
 */
export default function createStore(history, client, data) {
  // Sync dispatched route actions to the history
  const reduxRouterMiddleware = routerMiddleware(history);
// 生成中间件
  const middleware = [createMiddleware(client), reduxRouterMiddleware, thunk];
// 是在生成store过程中，一个函数，applyMiddleware(...middlewares)==>store enhancer (F)
  let finalCreateStore;
  if (__DEVELOPMENT__ && __CLIENT__ && __DEVTOOLS__) {
    const { persistState } = require('redux-devtools');
    const DevTools = require('../containers/DevTools/DevTools');
    finalCreateStore = compose(
      applyMiddleware(...middleware),
      window.devToolsExtension ? window.devToolsExtension() : DevTools.instrument(),
      persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
    )(_createStore);
  } else {
    finalCreateStore = applyMiddleware(...middleware)(_createStore);
  }
// 获取redux中的redux用于生成store,这里的redux是将所有的redux融合到一起的（总的）
  const reducer = require('./modules/reducer');
  if (data) {
    data.pagination = Immutable.fromJS(data.pagination);
  }
  //这个是项目最后用到的redux中的store
  const store = finalCreateStore(reducer, data);


  if (__DEVELOPMENT__ && module.hot) {
    module.hot.accept('./modules/reducer', () => {
      store.replaceReducer(require('./modules/reducer'));
    });
  }

  return store;
}
