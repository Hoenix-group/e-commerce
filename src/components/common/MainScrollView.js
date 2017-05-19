import React, { Component, PropTypes } from 'react';
import styles from './styles';
import { View, Text, Image, ScrollView, RefreshControl, Dimensions, PanResponder } from 'react-native';
import RefreshingIndicator from './RefreshingIndicator';


export default class MainScrollView extends Component {
    static propTypes = {
        releaseToLoad: PropTypes.func.isRequired,
        isShowRefreshing: PropTypes.bool,
        scrollDownToLoad: PropTypes.func.isRequired
    };
    constructor() {
        super();
        this.panResponder = null;
        this.state = {
            isHolding: false,
            isLoading: false
        };
        this._rTarget = null;
    }

    componentWillMount() {
        let that = this;
        this._panResponder = PanResponder.create({
            onPanResponderRelease: (evt, state) => {
                if (that.state.isHolding) {
                    this.setState({
                        isHolding: false
                    });

                    const { releaseToLoad } = that.props;
                    releaseToLoad();
                }
            }
        });
    }

    onScroll(e) {
        const windowHeight = Dimensions.get('window').height;
        const height = e.nativeEvent.contentSize.height;
        const offset = e.nativeEvent.contentOffset.y;
        if (windowHeight + offset >= height + 50) {
            //   dispatch({
            //     type: "landingTabGuessYourLikes/loadMore", lastRequestedPage
            //   })
            const { scrollDownToLoad } = this.props;
            scrollDownToLoad(e);
        }
    }

    onReloadLayoutdata() {
        console.log("set holding");
        this.setState({
            isHolding: true,
            isLoading: true
        });
    }

    render() {

        let { isShowRefreshing, style } = this.props;
        let _isLoading = this.state.isHolding ? this.state.isLoading : isShowRefreshing;
        return (
            <View style={style?[styles.windowCover, style]:styles.windowCover}>
                <View style={styles.fillParent}>
                    <RefreshingIndicator refreshing={_isLoading} isHolding={this.state.isHolding} />
                </View>
                <View style={[styles.fillParent]}>
                    <ScrollView
                        {...this._panResponder.panHandlers}
                        style={{ flex: 1 }}
                        ref={(scrollView) => { this._rTarget = scrollView; }}
                        automaticallyAdjustContentInsets
                        onScroll={(e) => this.onScroll(e)}
                        scrollEventThrottle={0}
                        refreshControl={
                            <RefreshControl
                                refreshing={_isLoading}
                                onRefresh={() => { this.onReloadLayoutdata() }}
                                tintColor="transparent"
                                progressBackgroundColor="transparent"
                            />
                        }>
                        {this.props.children}
                    </ScrollView>
                </View>
            </View>);
    }

}