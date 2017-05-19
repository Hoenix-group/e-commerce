import React, { Component, PropTypes } from 'react';
import { connect } from 'dva/mobile';
import {
    View,
    Text,
    ScrollView,
    Image,
    InteractionManager,
    TouchableHighlight,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Button, List, Toast, Modal } from 'antd-mobile';
import RootView from '../../components/common/RootView';
import FsRootView from '../../components/common/FsRootView';
import styles from './styles';

const Item = List.Item;
const alert = Modal.alert;
const iconRight = (<Image style={[{ width: 12, height: 12, paddingRight: 10, paddingLeft: 10 }]} source={require('./../../../images/productDetallsImgs/icons/rn-chevron-right.png')} />);

class ProfileView extends Component {
  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.props.dispatch({
        type: 'profile/loadProfile',
      });
    });
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'profile/initializeState',
    });
  }

  logout() {
    this.props.dispatch({
      type: 'preference/logout',
    });
  }

  changePhoto() {
    Toast.info('开发中');
  }

  changePassword() {
    Actions.password();
  }

  renderPositions(array) {
    if (!array) {
      return (null);
    }

    return (<View>
      {
        this.props.record.positions.map((entry, i) => (
          <Text key={i} style={[styles.rRightText, { textAlign: 'right' }]}>{entry.posDescript}</Text>
        ))
      }
    </View>);
  }

  render() {
    return (
      <FsRootView isNavBarHidden={false}>
        <View style={{ flex: 1 }}>
          <View style={styles.top} >
            <ScrollView>
              <View>
                <TouchableHighlight style={styles.rtouchStyle} underlayColor={'rgba(0,0,0,0)'} onPress={() => { this.changePhoto(); }} >
                  <View style={[styles.rView, styles.b_bottom]}>
                    <Image style={styles.logo} source={{ uri: this.props.record.profileUrl === '' ? 'https://camo.githubusercontent.com/7c73f8cfbb808b9a451dac7d9ff5cbc2b4883419/68747470733a2f2f7a6f732e616c697061796f626a656374732e636f6d2f726d73706f7274616c2f70736167534356484f4b515671714e6a6a4d64662e6a7067' : this.props.record.profileUrl }} />
                    <View style={styles.rRightView}>
                      {iconRight}
                    </View>
                  </View>
                </TouchableHighlight>

                <View style={styles.rtouchStyle} >
                  <View style={[styles.rView, styles.b_bottom]}>
                    <Text style={[styles.rLeftText]}>员工姓名</Text>
                    <Text style={[styles.rRightText]}>{this.props.record.lastName}{this.props.record.firstName}</Text>
                  </View>
                </View>

                <View style={styles.rtouchStyle} >
                  <View style={[styles.rView, styles.b_bottom]}>
                    <Text style={[styles.rLeftText]}>电话号码</Text>
                    <Text style={[styles.rRightText]}>{this.props.record.phone}</Text>
                  </View>
                </View>

                <View style={styles.rtouchStyle} >
                  <View style={[styles.rView, styles.b_bottom]}>
                    <Text style={[styles.rLeftText]}>工号</Text>
                    <Text style={[styles.rRightText]}>{this.props.record.id}</Text>
                  </View>
                </View>

                <View style={styles.rtouchStyle} >
                  <View style={[styles.rView, styles.b_bottom]}>
                    <Text style={[styles.rLeftText]}>所属分部</Text>
                    <Text style={[styles.rRightText]}>{this.props.record.belongsBranch}</Text>
                  </View>
                </View>

                <View style={styles.rtouchStyle} >
                  <View style={[styles.rView, styles.b_bottom]}>
                    <Text style={[styles.rLeftText]}>所属卖场</Text>
                    <Text style={[styles.rRightText]}>{this.props.record.belongsMarket}</Text>
                  </View>
                </View>

                <View style={styles.rtouchStyle} >
                  <View style={[styles.rView, styles.b_bottom]}>
                    <Text style={[styles.rLeftText]}>员工岗位</Text>
                    {this.renderPositions(this.props.record.positions)}
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>

          {/* 底部按钮 */}
          <View style={styles.bottom}>
            <TouchableHighlight underlayColor={'rgba(0,0,0,0.1)'} onPress={() => { this.changePassword(); }} style={styles.tStyle}>
              <View style={styles.footRight}>
                <Text style={styles.footRightText}>修改密码</Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight
              underlayColor={'rgba(0,0,0,0.1)'} onPress={() => {
                alert('确定退出?',
                  '退出不会删除个人设置及历史纪录。',
                  [
                      { text: '取消', onPress: () => {} },
                      { text: '确定', onPress: () => this.logout(), style: { fontWeight: 'bold' } },
                  ]);
              }} style={styles.tStyle}
            >
              <View style={[styles.footRight, styles.footRight2, { backgroundColor: '#DB0000' }]} >
                <Text style={styles.footRightText}>退出登录</Text>
              </View>
            </TouchableHighlight>
          </View>
        </View>
      </FsRootView>
    );
  }
}

ProfileView.propTypes = {
  record: PropTypes.object,
  dispatch: PropTypes.func,
};

const mapStateToProps = ({ profile }) => {
  const { profile: record } = profile;
  return { record };
};

export default connect(mapStateToProps)(ProfileView);
