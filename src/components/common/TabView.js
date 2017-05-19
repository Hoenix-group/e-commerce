import React, { PropTypes, Component } from 'react';
import { View, Text, Image, TouchableHighlight } from 'react-native';
import { Flex } from 'antd-mobile';
import { Actions } from 'react-native-router-flux';
import styles from './styles';
import { fontSizeLarge, lineColor, color33 } from '../../themes/fsBaseStyles';

class TabView extends Component {
  constructor(props) {
    super(props);
    const active = this.props.active;
    this.state = {
      active,
    };
  }
  switchTab(index) {
    this.setState({ active: index });
  }
  renderView() {
    return this.props.children[this.state.active];
  }

  renderTitle() {
    return this.props.titles.map(
        (v, i) => {
          const styleActive = this.state.active === i ? { borderBottomColor: '#1687dd', borderBottomWidth: 2 } : {};
          return (
            <View key={i} style={[{ height: 44, justifyContent: 'center' }, styleActive]}>
              <Text onPress={() => this.switchTab(i)} style={{ paddingHorizontal: 10, color: color33, fontSize: fontSizeLarge }}>{v}</Text>
            </View>
          );
        });
  }
  render() {
    return (
        <View style={[this.props.style]}>
          <View>
            <Flex style={{ height: 44, borderBottomWidth: 1, borderBottomColor: lineColor }}>
              <Flex.Item style={{ flex: 2, left: 5, marginHorizontal: 5 }} >
                <TouchableHighlight underlayColor={'transparent'} onPress={() => { this.props.name === 'mycart' ? Actions.home({ selectedTab: 'cart' }) : Actions.pop(); }}>
                  <Image style={styles.imgLeft} source={require('./../../../images/back_icon.png')} />
                </TouchableHighlight>
              </Flex.Item>
              <Flex.Item style={{ flex: 7 }} >
                <View style={{ flexDirection: 'row' }}>
                  {this.renderTitle()}
                </View>
              </Flex.Item>
            </Flex>
          </View>
          {this.renderView()}
        </View>
    );
  }
}

TabView.propTypes = {
  titles: PropTypes.array,
  children: PropTypes.array,
  style: PropTypes.object,
  active: PropTypes.number,
  name: PropTypes.string,
};

export default TabView;
