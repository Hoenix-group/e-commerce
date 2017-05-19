import React, { Component, PropTypes } from 'react';
import { View, Text, Image } from 'react-native';
import { List, Checkbox } from 'antd-mobile';

const Item = List.Item;

class GiftListItem extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <Item>
        <View style={{ flexDirection: 'row' }}>
          <Checkbox
            checked={() => {}}
            onChange={() => {}}
          />
          <Image srouce={require('./../../../images/sale_product_01_280x190.png')} />
          <View style={{ flexDirection: 'column' }}>
            <Text>商品介绍最多两行</Text>
            <Text>$100</Text>
          </View>
        </View>
      </Item>
    );
  }
}

GiftListItem.PropTypes = {

};

export default GiftListItem;
