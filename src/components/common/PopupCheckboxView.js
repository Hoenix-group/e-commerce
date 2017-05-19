import React, { Component, PropTypes } from 'react';
import { Checkbox, List, Button } from 'antd-mobile';
import { View, Text } from 'react-native';
import { commonButton } from './../../themes/fsBaseStyles';

export default class PopupCheckboxView extends Component {
  constructor(props) {
    super(props);
    this.baseitems = this.props.baseitems;
    this.state = {
      selected: this.props.selectItemValues,
    };
  }

  onSelect(value, { target }) {
    let newState = [];
    if (target.checked) {
      newState = [...this.state.selected, value];
      this.setState({ selected: newState });
    } else {
      newState = this.state.selected.filter(item => item !== value);
      this.setState({ selected: newState });
    }
  }

  onComfirm() {
    this.props.onSelect(this.state.selected);
    this.props.onComfirm();
  }

  render() {
    return (<View>
      <List>
        {this.baseitems.map(item => (
          <Checkbox.CheckboxItem key={item.value} checked={this.state.selected.includes(item.value)} onChange={checkboxitem => this.onSelect(item.value, checkboxitem)}>
            {item.label}
          </Checkbox.CheckboxItem>
      ))}
      </List>
      <Button type="primary" style={{ borderRadius: 0, height: commonButton.height, backgroundColor: commonButton.backgroundColor }} onClick={() => this.onComfirm()}>
        <Text style={{ color: commonButton.color }}>确定</Text>
      </Button>
    </View>);
  }
}

PopupCheckboxView.propTypes = {
  onSelect: PropTypes.func,
  onComfirm: PropTypes.func,
  selectItemValues: PropTypes.array,
  baseitems: PropTypes.array,
};
