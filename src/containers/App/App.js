import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { IndexLink } from 'react-router';
// 导入Ant Design Menu控件  start
import { Menu, Icon } from 'antd';
//  end
import { LinkContainer } from 'react-router-bootstrap';
import Navbar from 'react-bootstrap/lib/Navbar';
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';
import Helmet from 'react-helmet';
import { isLoaded as isInfoLoaded, load as loadInfo } from 'redux/modules/info';
import { isLoaded as isAuthLoaded, load as loadAuth, logout } from 'redux/modules/auth';
import { InfoBar } from 'components';
import { push } from 'react-router-redux';
import config from '../../config';
import { asyncConnect } from 'redux-async-connect';

@asyncConnect([{
  promise: ({store: {dispatch, getState}}) => {
    const promises = [];

    if (!isInfoLoaded(getState())) {
      promises.push(dispatch(loadInfo()));
    }
    if (!isAuthLoaded(getState())) {
      promises.push(dispatch(loadAuth()));
    }

    return Promise.all(promises);
  }
}])
@connect(
  state => ({user: state.auth.user}),
  {logout, pushState: push}
  )
export default class App extends Component {
  constructor(){
    super();
    this.state={
      current:'/'
    };
  }

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  componentWillReceiveProps(nextProps) {
    if (!this.props.user && nextProps.user) {
      // login
      this.props.pushState('/loginSuccess');
    } else if (this.props.user && !nextProps.user) {
      // logout
      this.props.pushState('/');
    }
  }

  handleLogout = (event) => {
    event.preventDefault();
    this.props.logout();
  };
  handleClFMenu=(e)=>{
    // console.log('click ', e);
    let currentTem =e.key;
    if(currentTem =="/logout"){
        this.setState({
          current:'/',
        });
    }else{
      this.setState({
          current:currentTem,
        });
    }
  
    this.props.pushState(currentTem);
  }
  render() {
    const {user} = this.props;
    const styles = require('./App.scss');

    return (
      <div className={styles.app} >
        <div className={styles.brand}/>
        <Menu
          onClick={this.handleClFMenu}
          selectedKeys={[this.state.current]}
          mode="horizontal"
        >
          <Menu.Item key="/">
             {config.app.title}
          </Menu.Item>
          <Menu.Item key="/chat">
            <Icon type="home" />聊天
          </Menu.Item>
          {<Menu.Item key="/widgets" >
            <Icon type="appstore" />widgets
          </Menu.Item>}
         {/* <Menu.Item key="/survey">
            <Icon type="home" />survey
          </Menu.Item>*/}
          <Menu.Item key="/pagination" >
            <Icon type="appstore" />pagination
          </Menu.Item>
          {!user &&
          <Menu.Item key="/login">
            登录
          </Menu.Item>}
          {user &&
          <Menu.Item key="/logout">
            登出
          </Menu.Item>}
        </Menu>
        
        <div className={styles.appContent}>
          {this.props.children}
        </div>
        <InfoBar/>

        <div className="well text-center">
          如有问题，请咨询 <a
          href="https://github.com/fanxiaowei/react-redux-webpack-antd-demo/issues"
          target="_blank">on Github</a> 
        </div>
      </div>
    );
  }
}
