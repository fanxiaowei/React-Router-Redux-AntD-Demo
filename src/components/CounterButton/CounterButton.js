import React, {Component, PropTypes} from 'react';
import {connectMultireducer} from 'multireducer';
import {increment} from 'redux/modules/counter';
import {Button} from 'antd';

@connectMultireducer(
  (key, state) => ({count: state.multireducer[key].count}),
  {increment}
)

export default class CounterButton extends Component {
  static propTypes = {
    count: PropTypes.number,
    increment: PropTypes.func.isRequired,
    className: PropTypes.string
  }

  props = {
    className: ''
  }

  render() {
    const {count, increment} = this.props; // eslint-disable-line no-shadow
    return (
      <Button onClick={increment} type={this.props.type}>
        You have clicked me {count} time{count === 1 ? '' : 's'}.
      </Button>
    );
  }
}
