import React, { Component } from 'react';
import { View, Text, TouchableWithoutFeedback, Platform, TouchableHighlight, Image } from 'react-native';
import TagStyle from './styles';
import {
    ScrollView
} from 'react-native';

export default class Tag extends Component {
  static defaultProps = {
    disabled: false,
    small: false,
    selected: false,
    closable: false,
    onClose() {},
    afterClose() {},
    onChange() {},
    onLongPress() {},
    styles: TagStyle,
    isUsenumberOfLinesAndNum: 0,
    isWidth: 3,
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
    const { disabled, onChange, selected} = this.props;
    if (disabled) {
      return;
    }
    const isSelect = selected;
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
  onLongPress= () => {
    if (this.props.onLongPress) {
      this.props.onLongPress();
    }
  }
  render() {
    const {childrens, disabled, small, closable, styles, style, isUsenumberOfLinesAndNum, selected, isWidth} = this.props;
    let wrapStyle;
    let textStyle;
    let textWidth;
    const width = isWidth ? isWidth : isWidth === 0 ? 0 : this.state.isWidth;
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
    if (isUsenumberOfLinesAndNum === 0 && isWidth > 5) {
      textWidth = styles.unChangetext
    } else {
      textWidth = styles.text
    }
    const sizeWrapStyle = small ? styles.wrapSmall : {};
    const sizeTextStyle = small ? styles.textSmall : {};
    return !this.state.closed ? (
      <View style={[ styles.tag, style,{paddingTop:5,paddingBottom:5, position: 'relative', zIndex: 888} ]}>
          <View style={[styles.wrap, sizeWrapStyle, wrapStyle]}>
            { isUsenumberOfLinesAndNum > 0 ? (<Text numberOfLines={isUsenumberOfLinesAndNum} onPress={this.onClick} onLongPress={this.onLongPress} style={[styles.text, sizeTextStyle, textStyle]}>{childrens.trim()} </Text>) : (<Text onPress={this.onClick} onLongPress={this.onLongPress} style={[textWidth, sizeTextStyle, textStyle]}>{childrens.trim()} </Text>) }
          </View>
        { closable && !small && !disabled &&
          <View
            style={[styles.close, Platform.OS === 'ios' ? styles.closeIOS : styles.closeAndroid]}>
             <TouchableHighlight style={styles.closeIcon} underlayColor={'rgba(0,0,0,0)'} onPress={this.onTagClose}>
              <Image style={{ width: 12, height: 12 }} source={require('./../../../images/search/rn-close-s.png')} />
            </TouchableHighlight>
          </View> }
      </View>
    ) : null;
  }
}