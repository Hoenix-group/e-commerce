import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import { connect } from 'dva/mobile';
import { Text } from 'antd-mobile';
import { ScrollView, View, InteractionManager } from 'react-native';
import styles from './styles';
import RootView from './../../components/common/RootView';

class PromotionDetailsView extends Component {
  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.props.dispatch({
        type: 'promotion/get',
        promotionId: this.props.promotionId,
      });
    });
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'promotion/setPromotion',
      promotion: {},
    });
  }

  getScopeSummary(scopes) {
    if (!scopes) {
      return '';
    }

    let summary = '';
    for (let i = 0; i < scopes.length; i += 1) {
      const scope = scopes[i];
      if (summary.length > 0) {
        summary += '  ';
      }
      summary += scope.channelName;
    }
    return summary;
  }

  getCityNamesSummary(scopes) {
    if (!scopes) {
      return (<View />);
    }

    let summary = '';
    for (let i = 0; i < scopes.length; i += 1) {
      const regions = [...scopes[i].provinceNames, ...scopes[i].cityNames];
      if (scopes[i].isWholeCountry) {
        summary += summary.length ? ',全国' : '全国';
      }

      if (regions.length) {
        if (summary.length > 0) {
          summary += ',';
        }
        summary += regions.join(',');
      }
    }

    if (summary.length > 0) {
      return (
        <View style={[styles.detailListView, styles.detailListViewFirst]}>
          <View style={{ width: 80 }}>
            <Text style={styles.detailListTitle}>促销区域:</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.detailListContent} numberOfLines={2}>{`${summary}`}</Text>
          </View>
        </View>
      );
    }

    return (<View />);
  }

  getPointOfServiceSummary(scopes) {
    if (!scopes) {
      return (<View />);
    }

    let summary = '';
    for (let i = 0; i < scopes.length; i += 1) {
      const names = scopes[i].pointOfServiceNames;
      if (names) {
        if (summary.length > 0) {
          summary += ',';
        }
        summary += names.join(',');
      }
    }

    if (summary.length > 0) {
      return (
        <View style={[styles.detailListView, styles.detailListViewFirst]}>
          <View style={{ width: 80 }}>
            <Text style={styles.detailListTitle}>促销门店:</Text>
          </View >
          <View style={{ flex: 1 }}>
            <Text style={styles.detailListContent} numberOfLines={2}>{`${summary}`}</Text>
          </View>
        </View>
      );
    }

    return (<View />);
  }

  render() {
    return (
      <RootView>
        <ScrollView style={styles.scrollBg}>
          <View style={[styles.bgFF, styles.flex]}>
            <View style={[styles.detailHeader]}>
              {/* <View style={styles.detailHeaderLeft}>*/}
              {/* <View style={[primaryIconView, styles.onlineIcon]}>*/}
              {/* <Text style={primaryIconText}>线上</Text>*/}
              {/* </View>*/}
              {/* </View>*/}
              <View style={styles.detailHeaderRight}>
                <Text numberOfLines={1} style={[styles.headerTitle, styles.fontSizeLarge]}>
                  {this.props.record.promotionName}
                </Text>
              </View>
            </View>
            <View style={[styles.detailListView, styles.detailListViewFirst, { marginTop: 15 }]}>
              <View style={{ width: 80 }}>
                <Text style={styles.detailListTitle}>促销名称:</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.detailListContent} numberOfLines={2}>{this.props.record.promotionName}</Text>
              </View>
            </View>
            <View style={[styles.detailListView, styles.detailListViewFirst]}>
              <View style={{ width: 80 }}>
                <Text style={styles.detailListTitle}>促销描述:</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.detailListContent} >{this.props.record.promotionDescription}</Text>
              </View>
            </View>
            <View style={[styles.detailListView, styles.detailListViewFirst]}>
              <View style={{ width: 80 }}>
                <Text style={styles.detailListTitle}>促销时间:</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.detailListContent}>{this.props.record.promotionStartTime ? moment(this.props.record.promotionStartTime).format('YYYY-MM-DD') : ''} 至 {this.props.record.promotionEndTime ? moment(this.props.record.promotionEndTime).format('YYYY-MM-DD') : ''}</Text>
              </View>
            </View>
            <View style={[styles.detailListView, styles.detailListViewFirst]}>
              <View style={{ width: 80 }}>
                <Text style={styles.detailListTitle}>促销渠道:</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.detailListContent}>{this.getScopeSummary(this.props.record.scopes)}</Text>
              </View>
            </View>
            {this.getCityNamesSummary(this.props.record.scopes)}
            {this.getPointOfServiceSummary(this.props.record.scopes)}
          </View>
        </ScrollView>
      </RootView>
    );
  }
}

PromotionDetailsView.propTypes = {
  record: PropTypes.object,
  promotionId: PropTypes.string,
  dispatch: PropTypes.func,
};

const mapStateToProps = ({ promotion }) => {
  const { promotion: record, promotionId } = promotion;
  return { record, promotionId };
};

export default connect(mapStateToProps)(PromotionDetailsView);
