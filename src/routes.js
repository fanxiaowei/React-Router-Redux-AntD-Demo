/**
 * 定义项目的所有的router
 * note01:此模块采用匿名函数的处理方式，利用函数的形式，传入Store来进行用户是否登录的判断
 * note02:利用return来返回一个JSX的项目框架
 * note03:注意Route中参数的不同
 */
import React from 'react';
import {IndexRoute, Route} from 'react-router';
import { isLoaded as isAuthLoaded, load as loadAuth } from 'redux/modules/auth';
import {
    App, 
    Chat,
    Home,
    Widgets,
    About,
    Login,
    LoginSuccess,
    Survey,
    NotFound,
    Pagination,
  } from 'containers';
import {message} from 'antd';

export default (store) => {
  /**
   * 
   * @param {*此参数主要是为了在isAuthLoaded} nextState 
   * @param {*在进行用户判断之后，根据不同的情况进行action的处理} replace 
   * @param {*} cb 
   */
  const requireLogin = (nextState, replace, cb) => {
    function checkAuth() {
      const { auth: { user }} = store.getState();
      if (!user) {
        message.info('由于用户没有登录，将会展示首页信息!',2);
        replace('/');
      }
      cb();
    }
    // 如果用户没有登录，需要进行登录的action的处理
    if (!isAuthLoaded(store.getState())) {
      store.dispatch(loadAuth()).then(checkAuth);
    } else {
      checkAuth();
    }
  };

  /**
   * Please keep routes in alphabetical order
   */
  return (
    <Route path="/" component={App}>
      { /* Home (main) route */ }
      <IndexRoute component={Home}/>

      { /* Routes requiring login */ }
      <Route onEnter={requireLogin}>
        <Route path="chat" component={Chat}/>
        <Route path="loginSuccess" component={LoginSuccess}/>
      </Route>

      { /* Routes */ }
      <Route path="about" component={About}/>
      <Route path="login" component={Login}/>
      <Route path="pagination" component={Pagination}/>
      <Route path="widgets" component={Widgets}/>

      { /* Catch all route */ }
      <Route path="*" component={NotFound} status={404} />
    </Route>
  );
};
