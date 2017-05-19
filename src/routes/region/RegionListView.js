import React, { PropTypes, Component } from 'react';
import { Actions } from 'react-native-router-flux';
import { connect } from 'dva/mobile';
import {
    View,
    Text,
    InteractionManager,
} from 'react-native';
import { List, SearchBar, ListView } from 'antd-mobile';
import { districtArray as districtData } from '../../data';
import RootView from '../../components/common/RootView';

import styles from './styles';

const { Item } = List;

class RegionListView extends Component {
  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      const getSectionData = (dataBlob, sectionID) => dataBlob[sectionID];
      const getRowData = (dataBlob, sectionID, rowID) => dataBlob[rowID];

      const dataSource = new ListView.DataSource({
        getRowData,
        getSectionHeaderData: getSectionData,
        rowHasChanged: (row1, row2) => row1 !== row2,
        sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
      });

      this.updateSearch('', this.createDs(dataSource, this.getLevelData()));
    });
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'region/initializeState',
    });
  }

  onSearch(val) {
    if (typeof val !== 'string') {
      return;
    }

    const filter = val.toLocaleLowerCase();
    const pd = { ...this.getLevelData() };
    Object.keys(pd).forEach((item) => {
      pd[item] = pd[item].filter((jj) => {
        const { label, spell, initial } = jj;
        return (label.toLocaleLowerCase().indexOf(filter) === 0) || (spell.toLocaleLowerCase().indexOf(filter) === 0) || (initial.toLocaleLowerCase().indexOf(filter) === 0);
      });
    });

    this.updateSearch(val, this.createDs(this.props.dataSource, pd));
  }

  onSelect(val) {
    if (this.props.onChange) {
      this.props.onChange(val);
    }

    this.cancelSearch();
  }

  getLevelData() {
    if (!this.props.level || (this.props.level.value >= 4 && this.props.level.type === 'scope')) {
      return districtData;
    }

    const data = [];
    Object.keys(districtData).forEach((item) => {
      const group = districtData[item].filter((entry) => {
        const level = Number(entry.level);
        if (this.props.level.type === 'scope') {
          return this.props.level.value >= level;
        }

        if (this.props.level.type === 'value') {
          return this.props.level.value === level;
        }

        return false;
      });

      data[item] = group;
    });

    return data;
  }

  cancelSearch() {
    Actions.pop();
  }

  updateSearch(inputValue, dataSource) {
    this.props.dispatch({
      type: 'region/updateSearch',
      inputValue,
      dataSource,
    });
  }

  createDs(ds, province) {
    const dataBlob = {};
    const sectionIDs = [];
    const rowIDs = [];
    let index = 0;
    Object.keys(province).forEach((item) => {
      if (province[item].length === 0) {
        return;
      }

      sectionIDs.push(item);
      dataBlob[item] = item;
      rowIDs[index] = [];

      province[item].forEach((entry) => {
        rowIDs[index].push(entry.value);
        dataBlob[entry.value] = entry;
      });

      index += 1;
    });

    return ds.cloneWithRowsAndSections(dataBlob, sectionIDs, rowIDs);
  }

  render() {
    if (!this.props.dataSource) {
      return (null);
    }

    return (
      <RootView isNavBarHidden>
        <View style={styles.labelRow}>
          <View style={styles.positionLabel} >
            <Text numberOfLines={1}>{(this.props.value && this.props.value.current) ? this.props.value.current.label : ''}</Text>
          </View>
          <View style={styles.searchBar}>
            <SearchBar
              value={this.props.inputValue}
              placeholder="城市名称"
              showCancelButton
              onCancel={() => { this.cancelSearch(); }}
              onChange={(val) => { this.onSearch(val); }}
              cancelText={<Text style={[styles.font_14]}>取消</Text>}
            />
          </View>
        </View>
        <View>
          <ListView
            enableEmptySections
            dataSource={this.props.dataSource}
            renderSectionHeader={sectionData => (<Text style={[styles.sectionColor, styles.font_g]}>{sectionData}</Text>)}
            renderRow={rowData => (<Item onClick={() => { this.onSelect(rowData); }}><Text style={[styles.font_12]}>{rowData.label}</Text></Item>)}
            stickyHeader
            stickyProps={{
              stickyStyle: styles.stickyStyle,
            }}
            quickSearchBarStyle={styles.quickSearchBarStyle}
            delayTime={10}
            delayActivityIndicator={<Text>渲染中...</Text>}
          />
        </View>

      </RootView>);
  }
}

RegionListView.propTypes = {
  inputValue: PropTypes.string,
  dataSource: PropTypes.object,
  dispatch: PropTypes.func,
  onChange: PropTypes.func,
  value: PropTypes.object,
  level: PropTypes.object,
};

const mapStateToProps = ({ region }) => {
  const { inputValue, dataSource } = region;
  return { inputValue, dataSource };
};

export default connect(mapStateToProps)(RegionListView);
