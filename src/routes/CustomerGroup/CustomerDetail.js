import React, { Component, PropTypes } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { List, Checkbox, Flex, Popup } from 'antd-mobile';
import { connect } from 'dva/mobile';
import styles from './styles';

const Item = List.Item;

class CustomerDetail extends Component {
  constructor() {
    super();

    this.itemClick = this.itemClick.bind(this);
    this.renderCustomerDetailTable = this.renderCustomerDetailTable.bind(this);
    this.getPopupContent = this.getPopupContent.bind(this);
  }

  onClose() {
    Popup.hide();
  }

  genFieldsMap(member) {
    var gender = '';
    if (member.gender === 'FEMALE') {
      gender = '女';
    } else if (member.gender === 'MALE') {
      gender = '男';
    }

    return {
      姓名: member.name || '',
      手机号码: member.phoneNumber || '',
      性别: gender || '',
      生日: member.birthday || '',
      地址: member.detailAddress || '',
      居住地址: member.detailAddress || '',
      需求类型: '',
      居住户型: '',
      居住面积: '',
      兴趣爱好: '',
      ymkt标签: '',
      分组: '',
    };
  }

  renderCustomerDetailTable(member) {
    const fieldsMap = this.genFieldsMap(member);

    return (
      <List>
        {Object.keys(fieldsMap).map((key, i) => (
          <Item key={key} onClick={key === '分组' ? this.itemClick : null}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={{ flex: 1 }}>{key}</Text>
              <Text style={styles.rightText}>{fieldsMap[key]}</Text>
            </View>
          </Item>
        ))}
      </List>
    );
  }

  getPopupContent(num) {
    return (
      <View>
        <List renderHeader={() => '客户分组'}>
          <Item key={1} onClick={() => { this.onClose(); }}>
            <View style={{ flexDirection: 'row' }}>
              <Checkbox style={styles.poptext} />
              <Text style={[styles.poptext, styles.textCenter]}>白富美</Text>
            </View>
          </Item>
          <Item key={2} onClick={() => { this.onClose(); }}>
            <View style={{ flexDirection: 'row' }}>
              <Checkbox style={styles.poptext} />
              <Text style={[styles.poptext, styles.textCenter]}>高富帅</Text>
            </View>
          </Item>
        </List>
      </View>
    );
  }

  itemClick() {
    Popup.show(
     this.getPopupContent(1), {
       maskClosable: true,
       animationType: 'slide-up',
       onMaskClose: this.onClose,
     });
  }

  render() {
    const customer = this.props.customer ? this.props.customer : {};

    return (
      <ScrollView style={{ marginTop: 64 }}>
        <View>
          {this.renderCustomerDetailTable(customer)}
        </View>
      </ScrollView>
    );
  }
}

CustomerDetail.propTypes = {
  customer: PropTypes.object,
  dispatch: PropTypes.func,
};

function mapStateToProps(state, props) {
  const { customer } = props;
  return { customer };
}

export default connect(mapStateToProps)(CustomerDetail);

