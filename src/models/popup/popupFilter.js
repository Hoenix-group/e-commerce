import Util from './../../utils/utils';

export default {
  namespace: 'popupFilter',
  state: {
    filterMenuIndex: -1,
    maskVisiable: false,
    maskLayout: {},
    filterDatas: [],
    menuStateArray: [],
  },
  reducers: {
    initMaskParamsByList(state, { layout }) {
      const { y, ...listLayout } = { ...layout };
      const maskLayout = state.maskLayout;
      return { ...state, maskLayout: { ...maskLayout, ...listLayout } };
    },

    initMaskParamsByButton(state, { layout }) {
      const y = layout.height;
      const maskLayout = state.popupState.maskLayout;
      return { ...state, popupState: { ...state.popupState, maskLayout: { ...maskLayout, y } } };
    },

    initMaskParams(state, { layout, winSize }) {
      const maskLayout = { x: 0, y: layout.height, width: winSize.width, height: winSize.height };
      // Util.consoleLog('maskLayout: ', maskLayout);
      return { ...state, maskLayout };
    },

    initDatas(state, { layout, winSize, filterDatas }) {
      const maskLayout = { x: 0, y: layout.height, width: winSize.width, height: winSize.height };
      return { ...state, popupState: { ...state.popupState, maskLayout }, filterDatas };
    },

    closeFilterMenu(state) {
      return { ...state, maskVisiable: false };
    },

    changeFilterMenuState(state, { index, visiable, changeArrow }) {
      const menuStateArray = state.menuStateArray;
      if (changeArrow) {
        menuStateArray[index].arrowDown = !menuStateArray[index].arrowDown;
        menuStateArray[index].itemSelectedIndex = (menuStateArray[index].itemSelectedIndex + 1) % 2;
        Util.consoleLog('sort item index: ', menuStateArray[index].itemSelectedIndex);
      }
      return { ...state, maskVisiable: visiable, filterMenuIndex: index, menuStateArray };
    },

    changeFilterItemState(state, { menuIndex, itemIndex, menuDisplayText }) {
      const menuStateArray = state.menuStateArray;
      menuStateArray[menuIndex].itemSelectedIndex = itemIndex;
      menuStateArray[menuIndex].displayText = menuDisplayText.length > 4 ? `${menuDisplayText.slice(0, 4)}` : menuDisplayText;
      return { ...state, menuStateArray, maskVisiable: false };
    },

    initButtonStates(state, { filterDataArrays }) {
      let filterMenuIndex = -1;
      const menuStateArray = [];
      filterDataArrays.forEach((data, index) => {
        const menuState = {
          arrowDown: true,
          displayText: data.title === undefined ? '' : data.title,
          itemSelectedIndex: data.defaultItemIndex === undefined ? -1 : data.defaultItemIndex,
        };
        menuStateArray.push(menuState);
        if (data.isDefault) {
          filterMenuIndex = index;
        }
      });
      return { ...state, filterMenuIndex, maskVisiable: false, menuStateArray };
    },
  },
};
