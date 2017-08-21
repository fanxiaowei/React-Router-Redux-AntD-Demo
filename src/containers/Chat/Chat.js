import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {Form,Input,Button,Icon,message} from 'antd';
const FormItem = Form.Item;
import { Map, is } from 'immutable'


@connect(
  state => ({user: state.auth.user})
)
@Form.create()
export default class Chat extends Component {

  constructor(props){
    super(props);
    this.state={
      messageInfo:'',
      messages:[],
    }

  }

  componentDidMount() {
    // const map1 = Map({ a: 1, b: 1, c: 1 })
    // const map2 = Map({ a: 1, b: 1, c: 1 })
    // console.log(map1 !== map2);
    // console.log(Object.is(map1, map2) === false);
    // console.log(is(map1, map2) === true);
    if (socket) {
      socket.on('msg', this.onMessageReceived);
      setTimeout(() => {
        socket.emit('history', {offset: 0, length: 100});
      }, 100);
    }
  }

  componentWillUnmount() {
    if (socket) {
      socket.removeListener('msg', this.onMessageReceived);
    }
  }

  onMessageReceived = (data) => {
    const messages = this.state.messages;
    messages.push(data);
    this.setState({messages});
  }

  handleSubmit = (event) => {
    event.preventDefault();
    let msgInfo = this.props.form.getFieldValue("chatInfo");
    const msg = msgInfo;
    socket.emit('msg', {
      from: this.props.user.name,
      text: msg
    });
    
  }
  // 处理Input输入
  /**
   * 本来想用input中的onChange来进行数据的接受，但是，在Form中处理onChange，发生了很诡异
   * 的事件，所以抛弃这种处理方式，
   * note01:ant design中API中说，可以使用onChange来进行控件的数据处理，但是，实验了一下
   * 功能都实现不了。
   */
  handleInputValue =(val)=>{
        // debugger;
        /**
         * valueFromHtml:利用html原生的事件机制获取值
         * valueFromAntd:利用antd中getFieldValue获取input输入值
         */
        let valueFromHtml = val.target.value;
        let valueFromAntd = this.props.form.getFieldValue('chatInfo');
        this.setState({
          messageInfo :valueFromAntd,
        },()=>{
          console.log(this.state.messageInfo,'messageInfomessageInfo')
        })
  }
  render() {
    const style = require('./Chat.scss');
    const {user} = this.props;
     const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
    return (
      <div className={style.chat + ' container'}>
        <h1 className={style}>让我知道你对我的心</h1>
        {user &&
        <div>
          <div>
            <ul>
            {this.state.messages.map((msg) => {
              return <li key={`chat.msg.${msg.id}`}>{msg.from}: {msg.text}</li>;
            })}
            </ul>
          </div>
          <Form >
            <FormItem>
                {getFieldDecorator('chatInfo', {
                  rules: [{
                    required: true,
                    whitespace: true,
                    message: "亲，请输入你想对我说的话！",
                  }],
                })(
                  <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} 
                          placeholder="请用言语来鞭策我吧！" 
                  />
                )}
            </FormItem>
            <FormItem>
              <Button type="primary" onClick={this.handleSubmit} >
                走你
              </Button>
            </FormItem>
          </Form>
        </div>
        }
      </div>
    );
  }
}
