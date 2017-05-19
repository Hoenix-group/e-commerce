import Dimensions from 'Dimensions';
import createStyle from './../../themes/styles';
import * as theme from './../../themes/styles/constants';

export default createStyle({
    itemTitle: {
        paddingVertical: 2,
        paddingLeft: theme.spaceSM
    },
    adImage: {
        width: Dimensions.get('window').width,
        height: (Dimensions.get('window').width * 3 / 4 - 20) / 3
    },
    gridStyle1: {
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        marginRight: theme.spaceSM
    },
    gridStyle2: {
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        marginRight: 34
    },
    prodImage: {
        width: (Dimensions.get('window').width * 3 / 4 - 108) / 3,
        height: (Dimensions.get('window').width * 3 / 4 - 108) / 3,
        marginBottom: 5
    },
    prodName: {
        fontSize: theme.fontSizeSM,
        marginBottom: 24
    },
    productArea: {
        paddingTop: theme.spaceSM,
        paddingLeft: theme.spaceSM
    },
    categoryItem: {
        borderBottomWidth: 1,
        borderBottomColor: theme.lineColor,
        borderLeftColor: "transparent",
        borderLeftWidth: 4,
        borderRightWidth: 1,
        borderRightColor: theme.lineColor,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18
    },
    categoryItemActive: {
        borderBottomWidth: 1,
        borderBottomColor: theme.lineColor,
        borderLeftColor: theme.brandPrimary,
        borderLeftWidth: 4,
        borderRightWidth: 1,
        borderRightColor: "transparent",
        backgroundColor: theme.separatorColor,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18
    },
    categoryName: {
        fontSize: theme.fontSizeMD,
        color: theme.textColor1,
        textAlign: 'center'
    },
    categoryNameActive: {
        fontSize: theme.fontSizeMD,
        color: theme.brandPrimary,
        textAlign: 'center'
    }
});

