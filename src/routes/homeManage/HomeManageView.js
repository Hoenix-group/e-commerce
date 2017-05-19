import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import { SearchBar, Tag, Grid, Button } from 'antd-mobile';
import styles from './styles';
import {
    View,
    Text
} from 'react-native';
export default class HomeManageView extends Component {
    constructor() {
        super();
        this.state = {
            "searchValue": " ",
        }
    }

    auotInputSearchItem(value) {
        this.setState({ "searchValue": value });
        this.toDetail();
    }

    render() {
        return (
            <View>
                <View style={[styles.commonTitle]}>
                    <Text>我的首页</Text>
                </View>
            </View>
        );
    }
}
