import React, { Component } from 'react';
import { View, Text, TouchableWithoutFeedback, Platform , ScrollView } from 'react-native';
import TagStyle from './styles';

export default class Tag extends Component {
	static defaultProps = {
		disabled: false,
		small: false,
		selected: false,
		closable: false,
		onClose() {},
		afterClose() {},
		onChange() {},
		styles: TagStyle,
	};

  closeDom: any;

  constructor(props) {
    super(props);

    this.state = {
      selected: props.selected,
      closed: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.selected !== nextProps.selected) {
      this.setState({
        selected: nextProps.selected,
      });
    }
  }

  onClick = () => {
    const { disabled, onChange } = this.props;
    if (disabled) {
      return;
    }
    const isSelect: boolean = this.state.selected;
    this.setState({
      selected: !isSelect,
    }, () => {
      if (onChange) {
        onChange(!isSelect);
      }
    });
  }

  onTagClose = () => {
    if (this.props.onClose) {
      this.props.onClose();
    }
    this.setState({
      closed: true,
    }, this.props.afterClose);
  }
  render() {
    const {childrens, disabled, small, closable, styles, style} = this.props;
    const selected = this.state.selected;

    let wrapStyle;
    let textStyle;
    if (!selected && !disabled) {
      wrapStyle = styles.normalWrap;
      textStyle = styles.normalText;
    }
    if (selected && !disabled) {
      wrapStyle = styles.activeWrap;
      textStyle = styles.activeText;
    }
    if (disabled) {
      wrapStyle = styles.disabledWrap;
      textStyle = styles.disabledText;
    }

    const sizeWrapStyle = small ? styles.wrapSmall : {};
    const sizeTextStyle = small ? styles.textSmall : {};

    return !this.state.closed ? (
      <View style={[ styles.tag, style,{paddingTop:5,paddingBottom:5, position: 'relative', zIndex: 888} ]}>
        <TouchableWithoutFeedback onPress={this.onClick} >
          <View style={[styles.wrap, sizeWrapStyle, wrapStyle]}>
            <Text numberOfLines={1} style={[styles.text, sizeTextStyle, textStyle]}>{childrens.trim()} </Text>
          </View>
        </TouchableWithoutFeedback>
        { closable && !small && !disabled && <TouchableWithoutFeedback
          onPressIn={this.onPressIn}
          onPressOut={this.onPressOut}
          onPress={this.onTagClose}
        >
          <View
            style={[styles.close, Platform.OS === 'ios' ? styles.closeIOS : styles.closeAndroid]}>
            <Text style={[styles.closeText]}>X</Text>
          </View>
        </TouchableWithoutFeedback> }
      </View>
    ) : null;
  }
}