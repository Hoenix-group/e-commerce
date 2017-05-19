import { Platform, StyleSheet } from 'react-native';
import * as _ from 'lodash';

import { default as common } from './common.js';
import  {baseStyle} from '../baseStyle.js';
import {commonStyles} from '../commonStyles';
// export { * as constants} from './constants';

export default function createStyle(oStyle) {
    if (!_.isObject(oStyle)) {
        return StyleSheet.create(Object.assign({}, baseStyle, commonStyles,common));
    } else {
        return StyleSheet.create(Object.assign({}, baseStyle, commonStyles, common, oStyle));
    }
}