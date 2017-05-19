import React, { Component, PropTypes } from 'react';
import { Text, Popover, Toast } from 'antd-mobile';
import { View } from 'react-native';
import { Actions } from 'react-native-router-flux';
import Util from './../../utils/utils';

export default class FsPopover extends Component {
  constructor(props) {
    super(props);
    this.baseitems = this.props.baseitems;
  }

  onSelect(opt) {
    Util.consoleLog(opt);
    const callback = Actions[opt];
    if (callback === undefined) {
      Toast.info('此功能正在开发，请耐心等待...');
      return;
    }
    callback();
  }

  render() {
    const Item = Popover.Item;
    return (
      <Popover
        overlay={
          this.baseitems.map((op, index) => (<Item key={index} value={op.action}><Text>{op.menuname}</Text></Item>))
        }
        overlayStyle={{ marginTop: 20 }}
        onSelect={this.onSelect}
      >
        <Text>更多</Text>
      </Popover>);
  }
}

FsPopover.propTypes = {
  baseitems: PropTypes.array,
};
