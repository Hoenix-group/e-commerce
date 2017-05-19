import React, { PropTypes } from 'react';
import { View } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { SearchBar } from 'antd-mobile';
import { connect } from 'dva/mobile';
import SearchList from './../../components/Search/SearchList';

function SearchListView({ searchVal, closable, dispatch }) {
  function onChange(value) {
    dispatch({
      type: 'Search/changeVal',
      searchVal: value,
    });
  }
  function onCancel() {
    dispatch({
      type: 'Search/changeVal',
      searchVal: '',
    });
  }
  function onSubmit() {
    const val = searchVal;
    dispatch({
      type: 'Search/submit',
      searchVal: val,
    });
  }
  function toDetail() {
    Actions.productList({ from: 'Home' });
  }
  function auotInputSearchItem(value) {
    onChange(value);
    toDetail();
  }
  function onLongPress() {
    dispatch({
      type: 'Search/onLongPress',
      closable: true,
    });
  }
  // 删除最近搜索中所有记录
  function closeAll() {
    dispatch({
      type: 'Search/closeAll',
    });
  }
    // 删除最近搜索中一条记录
  function onClose(key) {
    dispatch({
      type: 'Search/onClose',
      closable: true,
    });
  }
  return (
    <View>
      <SearchList closeAll={closeAll} Close={onClose} searchVal={searchVal} onLongPress={onLongPress} closable={closable} tagList={searchVal} auotInputSearchItem={auotInputSearchItem} />
    </View>
  );
}
SearchListView.propTypes = {
  searchVal: PropTypes.string,
  closable: PropTypes.bool,
  dispatch: PropTypes.func,
};
const mapStateToProps = ({ Search }) => {
  const { searchVal, closable } = Search;
  return { searchVal, closable };
};
export default connect(mapStateToProps)(SearchListView);
