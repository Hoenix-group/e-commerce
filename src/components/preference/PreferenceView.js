import React, { Component, PropTypes } from 'react';
import {
    View,
    Text,
    ScrollView,
    Image,
    InteractionManager,
    TouchableHighlight,
} from 'react-native';
import { connect } from 'dva/mobile';
import { List, Toast } from 'antd-mobile';
import { Actions } from 'react-native-router-flux';
import { shadeBg, lineColor } from './../../themes/fsBaseStyles';
import styles from './styles';

const Item = List.Item;
const iconRight = (<Image style={[{ width: 12, height: 12, paddingRight: 10, paddingLeft: 10 }]} source={require('./../../../images/productDetallsImgs/icons/rn-chevron-right.png')} />);

class PreferenceView extends Component {
  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.props.dispatch({
        type: 'preference/loadPreference',
      });
    });
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'preference/initializeState',
    });
  }

  viewProfile() {
    Actions.profile();
  }

  clearCache() {
    Toast.info('开发中');
  }

  changeFontSize(size) {
    this.props.dispatch({
      type: 'preference/setFontSize',
      fontSize: size,
    });
  }

  changeWIFILoading(checked) {
    this.props.dispatch({
      type: 'preference/setWIFILoading',
      wifiLoading: checked,
    });
  }

  updateVersion() {
    Toast.info('开发中');
  }

  viewReleaseNotes() {
    Toast.info('开发中');
  }

  render() {
    const fontSizes = [
      { value: 'NORMAL', label: '正常' },
      { value: 'BIG', label: '加大' },
    ];
    if (this.props.selectedTab && this.props.selectedTab === 'setting') {
      return (
        <View style={{ flex: 1, backgroundColor: shadeBg }}>
          <ScrollView>
            <View>
              <TouchableHighlight style={styles.rtouchStyle} underlayColor={'rgba(0,0,0,0)'} onPress={() => { this.viewProfile(); }} >
                <View style={[styles.rView, styles.b_bottom]}>
                  <View style={styles.rRightView}>
                    <Image style={styles.logo} source={{ uri: this.props.profile.photo }} />
                    <Text style={[styles.fontLarge, styles.textColor, styles.m_left]}>{this.props.profile.name}</Text>
                  </View>
                  <View style={styles.rRightView}>
                    {iconRight}
                  </View>
                </View>
              </TouchableHighlight>
              {/* <Item arrow="horizontal" onClick={() => { this.changePassword(); }}>
                <View>
                  <Text style={styles.font_18}>修改密码</Text>
                </View>
              </Item>
              <Item onClick={() => { this.clearCache(); }}>
                <View>
                  <Text style={styles.font_18}>清空缓存</Text>
                </View>
              </Item>
              <Item>
                <View style={styles.itemInnerRow}>
                  <View>
                    <Text style={styles.font_18}>字体大小</Text>
                  </View>
                  <View style={styles.itemInnerImage}>
                    {fontSizes.map(i => (
                      <Checkbox key={i.value} onChange={() => this.changeFontSize(i.value)} checked={i.value === this.props.fontSize}>
                        <Text style={styles.font_18}>{i.label}</Text>
                      </Checkbox>
                    ))}
                  </View>
                </View>
              </Item>
              <Item
                extra={
                  <Switch checked={this.props.wifiLoading} onChange={(checked) => { this.changeWIFILoading(checked); }} />}
              >
                <View>
                  <Text style={styles.font_18}>仅wifi下加载图片</Text>
                </View>
              </Item>*/}
              <TouchableHighlight style={styles.rtouchStyle} underlayColor={'rgba(0,0,0,0)'} onPress={() => { this.updateVersion(); }} >
                <View style={[styles.rView, styles.b_bottom]}>
                  <Text style={[styles.rLeftText, styles.fontLarge]}>版本更新</Text>
                  <View style={styles.rRightView}>
                    <Text style={[styles.rRightText, styles.fontLarge]}>{this.props.version}</Text>
                    {iconRight}
                  </View>
                </View>
              </TouchableHighlight>

              <TouchableHighlight style={styles.rtouchStyle} underlayColor={'rgba(0,0,0,0)'} onPress={() => { this.viewReleaseNotes(); }} >
                <View style={[styles.rView, styles.b_bottom]}>
                  <Text style={[styles.rLeftText, styles.fontLarge]}>版本申明</Text>
                  <View style={styles.rRightView}>
                    {iconRight}
                  </View>
                </View>
              </TouchableHighlight>
            </View>
          </ScrollView>
        </View>
      );
    }
    return (<View />);
  }
}

PreferenceView.propTypes = {
  profile: PropTypes.object,
  fontSize: PropTypes.string,
  wifiLoading: PropTypes.bool,
  version: PropTypes.string,
  dispatch: PropTypes.func,
  selectedTab: PropTypes.string,
};

const mapStateToProps = ({ preference }) => {
  const { profile, fontSize, wifiLoading, version } = preference;
  return { profile, fontSize, wifiLoading, version };
};

export default connect(mapStateToProps)(PreferenceView);
