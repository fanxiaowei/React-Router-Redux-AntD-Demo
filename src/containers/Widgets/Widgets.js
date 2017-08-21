import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import * as widgetActions from 'redux/modules/widgets';
import { isLoaded, load as loadWidgets } from 'redux/modules/widgets';
import { initializeWithKey } from 'redux-form';
import { WidgetForm } from 'components';
import { asyncConnect } from 'redux-async-connect';
// 引用AntDesign
import { Button, Table } from 'antd';
// 用于服务端渲染
/**
 * 对应的文档连接
 * 1、https://github.com/Rezonans/redux-async-connect/blob/master/docs/API.MD
 * 2、http://blog.csdn.net/xsl_bj/article/details/51353134
 * 3:为了在先于router事务发生之后， 将下面的 deferred: true,移除
 */
@asyncConnect([{
  promise: ({ store: { dispatch, getState } }) => {
    if (!isLoaded(getState())) {
      return dispatch(loadWidgets());
    }
  }
}])
@connect(
  state => ({
    widgets: state.widgets.data,
    editing: state.widgets.editing,
    error: state.widgets.error,
    loading: state.widgets.loading
  }),
  { ...widgetActions, initializeWithKey })
export default class Widgets extends Component {


  render() {
    const handleEdit = (widget) => {
      const { editStart } = this.props; // eslint-disable-line no-shadow
      return () => editStart(String(widget.id));
    };
    const { widgets, error, editing, loading, load } = this.props;
    let refreshClassName = 'fa fa-refresh';
    if (loading) {
      refreshClassName += ' fa-spin';
    }
    const styles = require('./Widgets.scss');
    const columns = [{
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: 100,
      fixed: 'left',
      filters: [{
        text: 'Joe',
        value: 'Joe',
      }, {
        text: 'John',
        value: 'John',
      }],
      onFilter: (value, record) => record.name.indexOf(value) === 0,
    }, {
      title: '杂项',
      children: [{
        title: '年龄',
        dataIndex: 'age',
        key: 'age',
        width: 200,
        sorter: (a, b) => a.age - b.age,
      }, {
        title: '街区',
        children: [{
          title: '街道',
          dataIndex: 'street',
          key: 'street',
          width: 200,
        }, {
          title: '街道',
          children: [{
            title: '楼牌号',
            dataIndex: 'building',
            key: 'building',
            width: 100,
          }, {
            title: '门牌号',
            dataIndex: 'number',
            key: 'number',
            width: 100,
          }],
        }],
      }],
    }, {
      title: '公司地址',
      children: [{
        title: 'Company Address',
        dataIndex: 'companyAddress',
        key: 'companyAddress',
      }, {
        title: '公司名',
        dataIndex: 'companyName',
        key: 'companyName',
      }],
    }, {
      title: '性别',
      dataIndex: 'gender',
      key: 'gender',
      width: 60,
      fixed: 'right',
    }];
    return (
      <div className={styles.widgets + ' container'}>
        <h1>
          Widgets
          <Button type="primary" onClick={load}>点击刷新==>我的下面哦！</Button>
        </h1>
        <Helmet title="Widgets" />
        <p>
          如果你刷新浏览器，数据将会先于页面返回，(数据是来源于服务器的)。<br />
          如果你从其他的页面中来，数据将会先于router的事务加载完成。(数据来源于客户端)<br />
          如何能够发生如此神奇的效果腻！该组件(页面)用了一个<code>@asyncConnect</code>装饰器，其中将对象数组中的
          <code>deferred</code>设为ture。<br />
        </p>
        <p>
          这些数据是存在于session中的，所以在编辑和刷新的时候，会感觉到很快。
        </p>
        {error &&
          <div className="alert alert-danger" role="alert">
            <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
            {' '}
            {error}
          </div>}
        <Table
          columns={columns}
          dataSource={widgets}
          bordered
          size="middle"
          scroll={{ x: '130%', y: 240 }}
        />
      </div>
    );
  }
}

