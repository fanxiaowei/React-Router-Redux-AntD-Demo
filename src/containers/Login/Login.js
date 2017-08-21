import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Helmet from 'react-helmet';
// import * as authActions from 'redux/modules/auth';
import {login,logout} from 'redux/modules/auth';
import {Form,Input,Button,Icon,message} from 'antd';
const FormItem = Form.Item;

@connect(
  state => ({user: state.auth.user}),
  dispatch=>bindActionCreators({
    login,
    logout
  },dispatch))
@Form.create()
export default class Login extends Component {
  
  constructor(props,context){
    super(props,context);
    this.state ={
      disableForSubmit : true,
    }
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.login(values.userName);
      }
    });
  }
  handleCFInput =(e) =>{
    let userName =e.target.value;
    if(userName){
      this.setState({
        disableForSubmit :false
      })
    }else{}
  }
  render() {
    const {user, logout} = this.props;
    const styles = require('./Login.scss');
     const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;

    return (
      <div className={styles.loginPage + ' container'}>
        <Helmet title="Login"/>
        <h1>Login</h1>
        {!user &&
        <div>
           <Form layout="inline" >
            <FormItem
            >
              {getFieldDecorator('userName', {
                rules: [{ required: true, message: '用户名不能为空！' }],
              })(
                <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="请输入用户名" onChange={this.handleCFInput}/>
              )}
            </FormItem>
            <FormItem>
              <Button
                type="primary"
                onClick={this.handleSubmit}
                disabled ={this.state.disableForSubmit}
              >
               登录
              </Button>
            </FormItem>
          </Form>
          <p>This will "log you in" as this user, storing the username in the session of the API server.</p>
        </div>
        }
        {user &&
        <div>
          <p>You are currently logged in as {user.name}.</p>

          <div>
            <button className="btn btn-danger" onClick={logout}><i className="fa fa-sign-out"/>{' '}Log Out</button>
          </div>
        </div>
        }
      </div>
    );
  }
}
