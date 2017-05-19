import React, { Component, PropTypes } from 'react';
import { View, ScrollView, Text, Image, InteractionManager } from 'react-native';
import { List, SwipeAction, Modal, InputItem } from 'antd-mobile';
import { connect } from 'dva/mobile';
import { Actions } from 'react-native-router-flux';
import styles from './styles';

const Item = List.Item;

class GroupView extends Component {
  constructor() {
    super();

    this.groupItem = this.groupItem.bind(this);
    this.addGroup = this.addGroup.bind(this);
    this.removeGroup = this.removeGroup.bind(this);
    this.switchAddGroupModal = this.switchAddGroupModal.bind(this);
    this.onChangeNewGroupName = this.onChangeNewGroupName.bind(this);
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.props.dispatch({
        type: 'CustomerGroup/getGroups',
      });
    });
  }

  // 控制模态框
  switchAddGroupModal() {
    // this.setState({ modalVisible: true });
    this.props.dispatch({
      type: 'CustomerGroup/swithAddGroupModal',
    });
  }

  onClose() {
    // this.setState({ modalVisible: false });
    this.switchAddGroupModal();
  }

  renderHeader() {
    return (
      <List>
        <Item onClick={this.switchAddGroupModal}>
            添加分组
         </Item>
      </List>
    );
  }

  // 右侧图片
  imgText() {
    return (
      <Image style={styles.icon} source={require('./../../../images/latop.png')} />
    );
  }

  addGroup(groupName) {
    this.props.dispatch({
      type: 'CustomerGroup/addGroup',
      group: groupName,
    });
  }

  removeGroup(groupName) {
    this.props.dispatch({
      type: 'CustomerGroup/removeGroup',
      group: groupName,
    });
  }

  onChangeNewGroupName(v) {
    this.props.dispatch({
      type: 'CustomerGroup/setNewGroupName',
      newGroupName: v,
    });
  }

  groupItem(itemText) {
    return (
      <SwipeAction
        key={itemText}
        style={{ backgroundColor: 'gray' }}
        autoClose
        right={[
          {
            text: '删除',
            onPress: () => this.removeGroup(itemText),
            style: { backgroundColor: '#F4333C', color: 'white' },
          },
        ]}
      >
        <Item extra={this.imgText()}>{itemText}</Item>
      </SwipeAction>
    );
  }

  render() {
    const groups = this.props.groups || [];

    return (
      <ScrollView style={{ marginTop: 64 }}>
        <View>
          <List renderHeader={this.renderHeader()} >
            {groups.map((e, i) => this.groupItem(e))}
          </List>
        </View>
        <View>
          <Modal
            title="分组添加"
            transparent
            maskClosable={false}
            visible={this.props.isVisibleAddGroupModal}
            footer={[
              { text: '取消', onPress: () => { this.onClose(); } },
              { text: '确定', onPress: () => { this.addGroup(this.props.newGroupName); this.onClose(); } }]}
          >
            <Text style={{ textAlign: 'center' }}>请输入分组名称</Text>
            <InputItem placeholder="请输入" value={this.props.newGroupName} onChange={this.onChangeNewGroupName} />
          </Modal>
        </View>
      </ScrollView>
    );
  }
}

GroupView.propTypes = {
  groups: PropTypes.array,
  dispatch: PropTypes.func,
  isVisibleAddGroupModal: PropTypes.bool,
  newGroupName: PropTypes.string,
};
const mapStateToProps = ({ CustomerGroup }) => {
  const { groups, isVisibleAddGroupModal, newGroupName } = CustomerGroup;
  return { groups, isVisibleAddGroupModal, newGroupName };
};
export default connect(mapStateToProps)(GroupView);
