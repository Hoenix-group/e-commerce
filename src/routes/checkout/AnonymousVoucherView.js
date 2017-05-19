import React, { Component, PropTypes } from 'react';
import { Text, Checkbox } from 'antd-mobile';
import { View, TextInput } from 'react-native';
import styles from './styles';

class AnonymousVoucherView extends Component {
  anonymousCodeChange(value) {
    this.props.anonymousCodeChange(value);
  }

  anonymousValidate(value) {
    this.props.anonymousValidate(value);
  }

  checkedChange(checked) {
    this.props.anonymousCheckedChange(checked);
  }

  render() {
    return (
      <View style={styles.checkboxContainer}>
        <Checkbox checked={this.props.anonymousChecked} onChange={(e) => { this.checkedChange(e.target.checked); }} style={[{ width: 16, height: 16 }, styles.m_left35, styles.mv5]} />
        <TextInput underlineColorAndroid="transparent" value={this.props.anonymousCode} onChangeText={(val) => { this.anonymousCodeChange(val); }} onBlur={() => this.anonymousValidate(this.props.anonymousCode)} style={styles.textInput} />
        {/* <Text style={[{ marginLeft: 5, color: '#108EE9' }, styles.fontSize12]} onPress={() => { this.anonymousValidate(this.props.anonymousCode); }}>验证</Text>*/}
      </View>
    );
  }
}

AnonymousVoucherView.propTypes = {
  anonymousCode: PropTypes.string,
  anonymousCodeChange: PropTypes.func,
  anonymousValidate: PropTypes.func,
  anonymousChecked: PropTypes.bool,
  anonymousCheckedChange: PropTypes.func,
};

export default AnonymousVoucherView;
