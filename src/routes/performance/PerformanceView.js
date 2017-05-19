import React from 'react';
import { connect } from 'dva/mobile';
import { Actions } from 'react-native-router-flux';
import { Text, List, Flex, SegmentedControl, Button, InputItem, Toast } from 'antd-mobile';
import { ScrollView, View, ListView, TextInput, Image } from 'react-native';
import styles from './styles';
import RootView from './../../components/common/RootView';
import Util from './../../utils/utils';

const PerformanceView = ({ dispatch, loading, selected, scoreData }) => {
  function _renderScore() {

  }
  Util.consoleLog(selected);
  function _changeScore(val) {
    if (val === '今日绩效') {
      Toast.info(val, 1);
//			dispatch({ type: 'score/fetchToday',selected: val});
    } else if (val === '7日绩效') {
      Toast.info(val, 1);
//			dispatch({ type: 'score/fetchWeek',selected: val});
    } else {
      Toast.info(val, 1);
//			dispatch({ type: 'score/fetchMonth',selected: val});
    }

  }
  return (
    <RootView style={{ flex: 1 }}>
      <List>
        <List.Item >
          <SegmentedControl
            selectedIndex={0} values={['今日绩效', '7日绩效', '30日绩效']}
            onValueChange={(val) => { _changeScore(val); }}
	  	        />
        </List.Item>
      </List>
      <ScrollView>
        <List>
          <List.Item>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <View style={{ flex: 0.5 }} />
              <View style={{ justifyContent: 'center' }}>
                <Text style={[styles.font_16]}>今日绩效总计:<Text style={[styles.font_18, { color: 'red' }]}> {scoreData.total}</Text></Text>
              </View>
            </View>
          </List.Item>
        </List>
        {scoreData.products.map((data, index) => (
          <View key={index}>
            <List>
              <List.Item style={{ paddingLeft: 0 }}>
                <Text style={{ marginLeft: 20 }}>订单号:<Text style={{ color: '#888' }}>{data.order}</Text></Text>
              </List.Item>
              <List.Item style={{ paddingLeft: 0 }}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                  {data.images.map((val, i) => (
                    <View key={i} style={{ marginLeft: 20 }}>
                      <Image style={[styles.image]} source={val.image} />
                    </View>))}
                </View>
              </List.Item>
              <List.Item style={{ paddingLeft: 0 }}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                  <View style={{ flex: 0.3 }} />
                  <View style={{ justifyContent: 'center' }}>
                    <Text style={{ marginLeft: 50 }}>共<Text style={[styles.font_16]}>{data.acount}</Text>件  实付款:<Text style={[styles.font_16]}>{data.price}</Text>  提成:<Text style={[styles.font_16, { color: 'red' }]}>{data.deduct}</Text></Text>
                  </View>
                </View>
              </List.Item>
            </List>
          </View>))}
      </ScrollView>
    </RootView>
  );
};

const mapStateToProps = state => ({
  scoreData: state.score.scoreData,
  selected: state.score.selected,
});
export default connect(mapStateToProps)(PerformanceView);
