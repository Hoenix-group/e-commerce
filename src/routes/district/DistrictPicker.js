import React, { PropTypes, Component } from 'react';
import { connect } from 'dva/mobile';
import {
    View,
    InteractionManager,
} from 'react-native';
import { List, Picker } from 'antd-mobile';
import { district as districtData } from '../../data';


class DistrictPicker extends Component {
  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.getCounties(this.props.value.cityCode);
      this.getTowns(this.props.value.countyCode);
    });
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'district/initializeState',
    });
  }

  onUpdateProvince(val) {
    const target = val[0];
    if (!target) {
      return;
    }

    const { onPickerChange } = this.props;
    const values = [target, '', '', ''];
    if (onPickerChange) {
      onPickerChange(values);
    }
  }

  onUpdateCity(val) {
    const target = val[0];
    if (!target) {
      return;
    }

    const callback = () => {
      const { value, onPickerChange } = this.props;
      const values = [value.provinceCode, target, '', ''];
      if (onPickerChange) {
        onPickerChange(values);
      }
    };

    this.getCounties(target, callback);
  }

  onUpdateCounty(val) {
    let target = val[0];
    if (!target) {
      target = this.props.defaultCounty;
    }

    const callback = () => {
      const { value, onPickerChange } = this.props;
      const values = [value.provinceCode, value.cityCode, target, ''];
      if (onPickerChange) {
        onPickerChange(values);
      }
    };

    this.getTowns(target, callback);
  }

  onUpdateTown(val) {
    let target = val[0];
    if (!target) {
      target = this.props.defaultTown;
    }

    const { value, onPickerChange } = this.props;
    const values = [value.provinceCode, value.cityCode, value.countyCode, target];
    if (onPickerChange) {
      onPickerChange(values);
    }
  }

  getCities() {
    const province = districtData.filter(entry => entry.value === this.props.value.provinceCode);
    return (province && province.length) ? province[0].children : [];
  }

  getCounties(cityCode, callback) {
    if (cityCode) {
      this.props.dispatch({
        type: 'district/getCounties',
        cityCode,
        callback,
      });
    }
  }

  getTowns(countyCode, callback) {
    if (countyCode) {
      this.props.dispatch({
        type: 'district/getTowns',
        countyCode,
        callback,
      });
    }
  }

  render() {
    const { value } = this.props;
    if (!value) {
      return (<View />);
    }

    return (
      <View>
        <Picker extra="请选择省" data={districtData} cols={1} title="选择省" triggerType="onClick" value={[value.provinceCode]} onChange={(val) => { this.onUpdateProvince(val); }}>
          <List.Item arrow="horizontal" wrap>省</List.Item>
        </Picker>
        <Picker extra="请选择市" data={this.getCities()} cols={1} title="选择市" triggerType="onClick" value={[value.cityCode]} onChange={(val) => { this.onUpdateCity(val); }}>
          <List.Item arrow="horizontal" wrap>市</List.Item>
        </Picker>
        <Picker extra="请选择区县" data={this.props.counties} cols={1} title="选择区县" triggerType="onClick" value={[value.countyCode]} onChange={(val) => { this.onUpdateCounty(val); }}>
          <List.Item arrow="horizontal" wrap>区县</List.Item>
        </Picker>
        <Picker extra="请选择街道" data={this.props.towns} cols={1} title="选择街道" triggerType="onClick" value={[value.townCode]} onChange={(val) => { this.onUpdateTown(val); }}>
          <List.Item arrow="horizontal" wrap>街道</List.Item>
        </Picker>
      </View>
    );
  }
}

DistrictPicker.propTypes = {
  onPickerChange: PropTypes.func,
  value: PropTypes.object,
  counties: PropTypes.array,
  towns: PropTypes.array,
  dispatch: PropTypes.func,
  defaultCounty: PropTypes.string,
  defaultTown: PropTypes.string,
};

const mapStateToProps = ({ district }) => {
  const { counties, towns, defaultCounty, defaultTown } = district;
  return { counties, towns, defaultCounty, defaultTown };
};

export default connect(mapStateToProps)(DistrictPicker);
