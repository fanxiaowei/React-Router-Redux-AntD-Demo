import React, { Component } from 'react';
// import { Link } from 'react-router';
import { CounterButton } from 'components';
import {Button,Input} from 'antd';
import config from '../../config';
import Helmet from 'react-helmet';

export default class Home extends Component {
  constructor(){
    super();
    this.state={
      value :0
    }
    //ref测试
    this.focus = this.focus.bind(this);
     
  }
  //ref测试
  focus() {
   // 直接使用原生 API 使 text 输入框获得焦点
   this.textInput.focus();
 }
 handleForTextAreaFocus(){
   this.pTextAreaId.focus();
 }
  //setState测试
  componentWillMount(){
    // this.setState({
    //   value :this.state.value+1
    // });
    // console.log(this.state.value,'111111111');
    // this.setState({
    //   value :this.state.value+1
    // });
    // console.log(this.state.value,'222222222222');
    // setTimeout(()=>{
    //   this.setState({
    //     value:this.state.value+1
    //   });
    //   console.log(this.state.value,'time111111111111');
    //   this.setState({
    //     value:this.state.value+1
    //   });
    //   console.log(this.state.value,'time222222222222');
    // },0)
    // setTimeout(()=>{
    //   console.log('tsadfhksadf',this.state.value);
    //   this.setState({
    //     value:this.state.value++
    //   })
    //   console.log('ttttttt',this.state.value);
    // },0);
    // this.setState({value:this.state.value++});
    // console.log('1111111111',this.state.value);
    // this.setState({value:this.state.value++});
    // console.log('222222222222222',this.state.value);
  }
  //setState测试02
  componentDidMount(){
    // this.setState({
    //   value :this.state.value+1
    // });
    // console.log(this.state.value,'did111111111');
    // this.setState({
    //   value :this.state.value+1
    // });
    // console.log(this.state.value,'idd222222222222');
    // setTimeout(()=>{
    //   this.setState({
    //     value:this.state.value+1
    //   });
    //   console.log(this.state.value,'dddddddtime111111111111');
    //   this.setState({
    //     value:this.state.value+1
    //   });
    //   console.log(this.state.value,'ddddddddddddtime222222222222');
    // },0)
    setTimeout(()=>{
      console.log('setTime中正常输出',this.state.value);
      this.setState({
        value:this.state.value++
      },()=>{
        if(this.state.value==1){
          console.error('这里是一个需要特别注意的地方:(这里在赋值的时候，用的是++)',this.state.value);
        }else{
          console.log('进行setState之后的处理',this.state.value);
        }
        
      })
      console.log('setTime最后的输出',this.state.value);
    },0);
    this.setState({value:this.state.value+1});
    console.log('setState01',this.state.value);
    this.setState({value:this.state.value+1});
    console.log('setState02',this.state.value);
  }

  render() {
    const styles = require('./Home.scss');
    // require the logo image both from client and server
    const logoImage = require('./logo.png');
    return (
      <div className={styles.home}>
        <Helmet title="Home"/>
        <div>
            <ul >
              <li>下面的三个Button是利用multireducer，来实现重用 Redux 中的 reducer。
              对应的处理步骤</li>
              <li>step01：定义一个公用的reducer。对应的文档位置为src\redux\modules\counter.js</li>
              <li>step02:将定义好的reducer文件combine到总得rootReducer中 。对应的文档位置src\redux\modules\reducer.js</li>
              <li>step03:在控件中进行redux数据(state、action)的调用。对应的文档位置 src\components\CounterButton\CounterButton.js</li>
              <li>step04:组件的调用。对应的文档位置 src\containers\Home\Home.js</li>
              <li>在处理过程中，需要注意以下几点</li>
              <li>note01：在添加到rootReducer中需要利用multireducer进行类比的区分 ==>step02</li>
              <li>note02:在控件中进行redux数据的处理时，需要在组件关联组件的过程中利用connectMultireducer进行处理 ==>step03</li>
              <li>note03:在进行组件调用的时候，需要在组件中定义一个与note01相关的属性</li>
            </ul>
        </div>
        <div className="container">
          <div className={styles.counterContainer}>
            <CounterButton multireducerKey="counter1" type="primary"/>
            <CounterButton multireducerKey="counter2" type="dashed"/>
            <CounterButton multireducerKey="counter3" type="danger"/>
          </div>
          {/*ref测试*/}
          <div className={styles.styleForRef}>
            这块整理的react中ref中相关的知识点：<br/>
            tip01:在需要获取真实DOM节点处,添加ref属性(是一个函数)，使用该回调函数将元素or组件的DOM节点存储到React实例上。<br/>
            tip02:需要用一个触发事件，来对该DOM节点进行操作(focus....),我这里是利用的Button的点击事件来进行DOM元素的操作。<br/>
            <span className={styles.note}>在源码中需要注意</span>
            note00:特别注意在ref回调函数中参数的处理，和触发事件中this.xxx.(事件方法)的匹配。<br/>
            note01:在react进行回调函数的处理的时候，如果该回调没有参数，可以采用es7的::的写法<br/>
          </div>
          <div>
            <textarea name="DIVCSS5" cols="30" rows="4" ref={(textarea)=>{this.pTextAreaId = textarea}}>
              请问施主从何而来！老衲从五台山来！
            </textarea>
            <Button onClick={::this.handleForTextAreaFocus}>官人，点我，点我！</Button>
            <input  type="text"   ref={(input) => { this.textInput = input; }} />
             <Button      onClick={this.focus}>客官，点我O!</Button>
          </div>
          <div>
            <span className="styleForRef">
              注意：最关键的部分在浏览器的控制台，F12之后，刷新页面，会有一堆输出，参看componentDidMount中对应的代码。
              然后想看其他的情况，将对应的代码注释进行释放，然后参看对应的处理方式。(关于相关的原理，会有一篇博文。)
            </span>
          </div>
        </div>
      </div>
    );
  }
}
