import React, {Component} from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableHighlight,
  Platform,
} from 'react-native';
import FsSearchBarStyle from './FsSearchBarStyle';

class FsSearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      focus: false,
      value: '',
    };
  }
  onFocus = () => {
    this.setState({
      focus: true,
    });
    if (this.props.onFocus) {
      this.props.onFocus();
    }
  };
  clear = () => {
    this.setState({
      value: '',
    });
    if (this.props.clear) {
      this.props.clear();
    }
  }
  onBlur = () => {
    this.setState({
      focus: false,
    });
    if (this.props.onBlur) {
      this.props.onBlur();
    }
  }
  render() {
    const cancelText = this.props.cancelText || '取消';
    let _showCancelButton = true;
    if (this.props.showCancelButton) {
      _showCancelButton = this.state.focus;
    }else {
      _showCancelButton = this.props.showCancelButton;
    }
    const _value = this.props.searchVal || this.state.value;
    const left = this.props.leftSide ? FsSearchBarStyle.imageLeft2 : {};
    const right = this.props.rightSide ? FsSearchBarStyle.imageRight2 : {};
    const right2 = !this.props.rightSide && _showCancelButton ? FsSearchBarStyle.imageRight3 : {};
    const padding = this.props.showText || this.props.leftSide || this.props.rightSide ? {} : FsSearchBarStyle.paddingL;
    const right3 = this.props.showrightImg ? FsSearchBarStyle.imageRight5 : {};
    
    return (
      <View style={[FsSearchBarStyle.view, padding,{paddingBottom:6}]}>
        {
          this.props.leftSide ? (
            <View style={FsSearchBarStyle.searchBarLeft} >
              {this.props.leftSide}
            </View>) : (null)
        }
        {
          this.props.showText ? (
            <Text
              style={[FsSearchBarStyle.textInput, FsSearchBarStyle.text]}
              placeholder={this.props.placeholder}
              onPress={() => this.props.action()}
              underlineColorAndroid="transparent"
            >{this.props.placeholder}</Text>
              ) : (
                <TextInput
                  style={FsSearchBarStyle.textInput}
                  placeholder={this.props.placeholder}
                  onChangeText={(text) => { this.props.onChange(text); }}
                  onSubmitEditing={() => { this.props.onSubmit(); }}
                  keyboardType="default"
                  clearButtonMode={'while-editing'}
                  underlineColorAndroid="transparent"
                  value={_value}
                  onFocus={this.onFocus}
                  onBlur={this.onBlur}
                />)
        }
        <Image style={[FsSearchBarStyle.imageLeft, left]} resizeMode="stretch" source={this.props.showText ? require('./../../../images/searchbar/search@2x.png') : require('./../../../images/searchbar/search@2x.png')} />
        {
          this.state.focus && _value.trim().length > 0 && Platform.OS === 'android' ? (<View style={[FsSearchBarStyle.imageRight, right, right2, right3]}>
              <TouchableHighlight underlayColor={'rgba(0,0,0,0)'} onPress={() => {this.props.clear(); }}>
              <Image style={FsSearchBarStyle.imageRight4} source={require('./../../../images/searchbar/Clear.png')} />
            </TouchableHighlight></View>) : (null)
        }
        {
          this.props.showrightImg ? (<View style={[FsSearchBarStyle.imageRight, right, right2]}>
              <TouchableHighlight underlayColor={'rgba(0,0,0,0)'} onPress={() => {this.props.rightPress(); }}>
              <Image style={FsSearchBarStyle.imageRight4} source={require('./../../../images/searchbar/tsk_barcode@2x.png')} />
            </TouchableHighlight></View>) : (null)
        }
        {
          this.props.rightSide && !this.props.showCancelButton ? (
            <View style={FsSearchBarStyle.searchBarRight}>
              {this.props.rightSide}
            </View>
          ) : (null)
        }
        {
          _showCancelButton ? (
            <View style={FsSearchBarStyle.cancelTextContainel}>
              <Text style={FsSearchBarStyle.cancelText} onPress={() => {this.props.onCancel(); }}>
                {cancelText}
              </Text>
            </View>
          ) : (null)
        }
      </View>
    );
  }
}
export default FsSearchBar;

