import React, { Component, PropTypes } from 'react';
import { View, Text, InteractionManager } from 'react-native';
import { Modal, InputItem, Popup, List } from 'antd-mobile';
import { connect } from 'dva/mobile';
import { Actions, ActionConst } from 'react-native-router-flux';

const Item = List.Item;

class ConsumptionPointDetail extends Component {
  constructor() {
    super();

    this.state = {};
  }

  // componentDidMount() {
  //   InteractionManager.runAfterInteractions(() => {
  //     this.getConsumptionPointDetail();
  //   });
  // }

  // getConsumptionPointDetail() {
  //   this.props.dispatch({
  //     type: 'ConsumptionPoint/searchCustomer',
  //     phone: this.props.phone,
  //   });
  // }

  genFieldsMap(detail) {
    if (!detail) {
      return {};
    }

    const { totalPointAccount } = detail;
    return {
      姓名: detail.name || '',
      手机号码: detail.phoneNumber,
      可用积分数量: totalPointAccount.availablePoint,
      最近积分到期数量: totalPointAccount.expiringPoint,
      最近积分到期时间: totalPointAccount.expiringDate,
    };
  }

  renderDetailTable(detail) {
    const fieldsMap = this.genFieldsMap(detail);

    return (
      <View style={{ marginTop: 64 }}>
        <List>
          {Object.keys(fieldsMap).map((key, i) => (
            <Item key={key}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ flex: key.length > 4 ? 2 : 1 }}>{key}</Text>
                <Text style={{ flex: 2 }}>{fieldsMap[key]}</Text>
              </View>
            </Item>
          ))}
        </List>
      </View>
    );
  }

  render() {
    const detail = this.props.detail ||
      {
        name: 'test1',
        phone: '2',
      };

    return (
      <View>
        {this.renderDetailTable(detail)}
      </View>
    );
  }
}

ConsumptionPointDetail.propTypes = {
  dispatch: PropTypes.func,
  detail: PropTypes.object,
};

function mapStateToProps(state, props) {
  const { phone } = props;
  return { phone };
}

export default connect(mapStateToProps)(ConsumptionPointDetail);
