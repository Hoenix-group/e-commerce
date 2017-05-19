// import * as activityService from '../../services/activityService';

export default {
  namespace: 'activity',
  state: {
    acData: {
      aclist: [
        {
          name: '迎新春电脑大促销',
          type: '线下',
          adress: '南京市鼓楼店',
          options: '预约活动',
          startTime: '2017.1.1',
          endTime: '2017.1.31',
          releTime: '12月30日 11:00',
        },
        {
          name: '迎新春电脑大促销',
          type: '线下',
          adress: '南京市中山店',
          options: '预存活动',
          startTime: '2017.1.1',
          endTime: '2017.1.31',
          releTime: '12月30日 11:00',
        },
        {
          name: '五一电脑大促销',
          type: '线上',
          adress: '苏州市新街口店',
          options: '预约活动',
          startTime: '2017.1.1',
          endTime: '2017.1.31',
          releTime: '12月30日 11:00',
        },
        {
          name: '迎新春电脑大促销',
          type: '线下',
          adress: '南京市鼓楼店',
          options: '预约活动',
          startTime: '2017.1.1',
          endTime: '2017.1.31',
          releTime: '12月30日 11:00',
        },
        {
          name: '迎新春电脑大促销',
          type: '线下',
          adress: '南京市中山店',
          options: '预存活动',
          startTime: '2017.1.1',
          endTime: '2017.1.31',
          releTime: '12月30日 11:00',
        },
        {
          name: '五一电脑大促销',
          type: '线上',
          adress: '苏州市新街口店',
          options: '预约活动',
          startTime: '2017.1.1',
          endTime: '2017.1.31',
          releTime: '12月30日 11:00',
        },
      ],
      acAddresses: ['苏州市新街口店', '南京市中山店', '南京市鼓楼店'],
      acFilterInfos: [
        {
          title: '所有门店',
          filterItems: [
            {
              text: '苏州市新街口店',
              trigerTag: false,
            },
            {
              text: '南京市中山店',
              trigerTag: false,
            },
            {
              text: '南京市鼓楼店',
              trigerTag: false,
            },
          ],
        }, {
          title: '渠道',
          filterItems: [{
            text: '线上',
            trigerTag: false,
          },
          {
            text: '线下',
            trigerTag: false,
          },
          ],
        }, {
          title: '区域',
          filterItems: [{
            text: '1.1-1.31',
            trigerTag: false,
          },
          ],
        },
        {
          title: '促销类型',
          filterItems: [{
            text: '预约活动',
            trigerTag: false,
          },
          {
            text: '预存活动',
            trigerTag: false,
          },
          ],
        },
      ],
    },
  },
  effects: {
    * fetchGetCode({ employeePhone }, { put }) {
      yield put({ type: 'loading', loading: true, disabled: true, inputEditable: false });
    },

  },
  reducers: {
    loading(state, { loading: status, inputEditable }) {
      return { ...state, loading: status, inputEditable };
    },

    changeFilterItemState(state, { buttonIndex, itemIndex }) {
      const filterDatas = state.acData.acFilterInfos;
      filterDatas[buttonIndex].filterItems[itemIndex].trigerTag = !filterDatas[buttonIndex].filterItems[itemIndex].trigerTag;
      return { ...state, acData: { ...state.acData, acFilterInfos: filterDatas } };
    },
  },
};
