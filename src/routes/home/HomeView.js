import React, { PropTypes, Component } from 'react';
import { connect } from 'dva/mobile';
import { TabBar } from 'antd-mobile';
import { View } from 'react-native';

import HomeComponent from './../../components/home/HomeComponent';
import CategoryTab from './../../components/category/CategoryTab';
import CartComponent from './../../components/cart/CartComponent';
import PreferenceView from './../../components/preference/PreferenceView';
import FsRootView from './../../components/common/FsRootView';
import { shadeBg2, shadeBg1 } from './../../themes/fsBaseStyles';

const TabBarItem = TabBar.Item;

class HomeView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedTab: this.props.selectedTab ? this.props.selectedTab : 'home',
    };
  }

  switchTabView(selected) {
    this.setState({ selectedTab: selected });
  }

  render() {
    const selectedTab = this.state.selectedTab;

    return (
      <FsRootView isNavBarHidden type={selectedTab}>
        <TabBar barTintColor={shadeBg2}>
          <TabBarItem
            onPress={() => this.switchTabView('home')}
            selected={selectedTab === 'home'}
            icon={require('./../../../images/homeTab/home.png')}
            selectedIcon={require('./../../../images/homeTab/home_selected.png')}
            title="首页"
          >
            <HomeComponent selectedTab={selectedTab} />
          </TabBarItem>
          <TabBarItem
            onPress={() => this.switchTabView('sales')}
            selected={selectedTab === 'sales'}
            icon={require('./../../../images/homeTab/prompt.png')}
            selectedIcon={require('./../../../images/homeTab/prompt_selected.png')}
            title="热销商品"
          >
            <CategoryTab selectedTab={selectedTab}/> 
          </TabBarItem>
          <TabBarItem
            selected={selectedTab === 'cart'}
            onPress={() => this.switchTabView('cart')}
            icon={require('./../../../images/homeTab/cart.png')}
            selectedIcon={require('./../../../images/homeTab/cart_selected.png')}
            title="挂单中心"
          >
            <CartComponent selectedTab={selectedTab} />
          </TabBarItem>
          <TabBarItem
            onPress={() => this.switchTabView('hotSales')}
            selected={selectedTab === 'hotSales'}
            icon={require('./../../../images/homeTab/sell.png')}
            selectedIcon={require('./../../../images/homeTab/sell_selected.png')}
            title="今日销售"
          >
            <View style={{ flex: 1, backgroundColor: shadeBg1 }} />
          </TabBarItem>
          <TabBarItem
            onPress={() => this.switchTabView('setting')}
            selected={selectedTab === 'setting'}
            icon={require('./../../../images/homeTab/settings.png')}
            selectedIcon={require('./../../../images/homeTab/settings_selected.png')}
            title="设置"
          >
            <PreferenceView selectedTab={selectedTab} />
          </TabBarItem>
        </TabBar>
      </FsRootView>
    );
  }
}

HomeView.propTypes = {
  selectedTab: PropTypes.string,
};


const mapStateToProps = () => ({});
export default connect(mapStateToProps)(HomeView);
