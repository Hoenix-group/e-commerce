import React, { PropTypes } from 'react';
import { connect } from 'dva/mobile';
import { ActivityIndicator } from 'antd-mobile';

const ActivityIndicatorView = ({ loading }) => (
  <ActivityIndicator
    toast
    text="正在加载"
    animating={loading}
  />
  );

ActivityIndicatorView.propTypes = {
  loading: PropTypes.bool,
};

const mapStateToProps = state => ({
  loading: state.loading.global,
});

export default connect(mapStateToProps)(ActivityIndicatorView);
