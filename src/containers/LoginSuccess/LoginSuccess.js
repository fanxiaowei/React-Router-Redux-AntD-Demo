import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import * as authActions from 'redux/modules/auth';
import {Button} from 'antd';

@connect(
    state => ({user: state.auth.user}),
    authActions)
export default
class LoginSuccess extends Component {
  static propTypes = {
    user: PropTypes.object,
    logout: PropTypes.func
  }

  render() {
    const {user, logout} = this.props;
    return (user &&
      <div className="container">
        <h1>登录成功</h1>

        <div>
          <p>Hi, {user.name}.老铁，你已经等了成功了。同时你的名字，是由Login中的<code>this.props.login(values.userName)</code>
          来进行将userName发送到redux中，同时，在此组件中利用<code>@connect</code>来监听redux的数据。
          </p>

          <p>
            下面的按钮是用于登出操作的！
          </p>

          <div>
            <Button onClick={logout}>老娘要上天了！</Button>
          </div>
        </div>
      </div>
    );
  }
}
