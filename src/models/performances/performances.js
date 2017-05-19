//import * as scoreService from '../../services/scoreService';
import { Actions } from 'react-native-router-flux';
import * as authentication from '../../utils/authentication';
import { Toast } from 'antd-mobile';

export default {
  namespace: 'score',
  state: {
    loading: false,
    disabled: true,
    selected: '今日绩效',
    scoreIndex: 0,
    scoreData: {
      total :'¥1788.00',
      products: [
        {
          order: '20161231001234',
          acount: '2',
          price: '¥6788.00',
          deduct: '¥1643.00',
          images: [
            {
          	   image:require('./../../../images/latop.png'),
            },
            {
          	   image:require('./../../../images/latop.png'),
            }
          ]
        },
        {
          order: '20161231001233',
          acount: '1',
          price: '¥1788.00',
          deduct: '¥143.00',
          images: [
            {
          	   image:require('./../../../images/latop.png'),
            }
          ]
        },
        {
          order: '20161231001232',
          acount: '2',
          price: '¥4788.00',
          deduct: '¥643.00',
          images: [
            {
          	   image:require('./../../../images/latop.png'),
            },
            {
          	   image:require('./../../../images/latop.png'),
            }
          ]
        },
        {
          order: '20161231001231',
          acount: '1',
          price: '¥3455.00',
          deduct: '¥343.00',
          images: [
            {
          	   image:require('./../../../images/latop.png'),
            }
          ]
        },
      ],
    },
  },
  effects: {
    * fetchToday({ selected }, { call, put }) {
      yield put({ type: 'loading', loading: true,disabled: true, inputEditable: false });
      const data = yield call(scoreService.getToday);
    },
    * fetchWeek({ selected }, { call, put }) {
      yield put({ type: 'loading', loading: true,disabled: true, inputEditable: false });
      const data = yield call(scoreService.getWeek);
    },
    * fetchMonth({ selected }, { call, put }) {
      yield put({ type: 'loading', loading: true,disabled: true, inputEditable: false });
      const data = yield call(scoreService.getMonth);
    },
  },
  reducers: {
    loading(state, { loading: status, inputEditable }) {
      return { ...state, loading: status, inputEditable };
    },
    changeScore(state, { selectScore: val }){
    	return { ...state, selectScore: val};
    },
  },
};