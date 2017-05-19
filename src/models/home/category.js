import * as categoryService from './../../services/categoryService';

export default {
  namespace: 'category',
  state: {
    dataList: [],
    subCategories: [],
    selected: [],
    loading: true
  },
  effects: {
    * fetchcategory(action, { call, put }) {
      yield put({type:'saveLoading', loading: true});
      const category = yield call(categoryService.initialCategory);
      const selected = [];
      category.data.subCategories.map((item, index) => {
        return selected.push(false);
      })
      yield put({type: 'saveSelect', selected});
      yield put({ type: 'saveCategory', category });
      yield put({type: 'selectCategory', categoryname: 0});
      yield put({type:'saveLoading', loading: false});
    },
    *selectCategory(action, {call, put, select}) {
      const selected = yield select(state => (state.category.selected))
      const selectedTemp = [...selected].fill(false);
      selectedTemp[action.categoryname] = true;
      yield put({type: 'saveSelect', selected: selectedTemp})
      yield put({type: 'saveSelectCategory', categoryname: action.categoryname});
    }
  },
  reducers: {
    saveCategory(state, {category}) {
      const {subCategories} = category.data;
      return {...state, subCategories }
    },
    saveSelectCategory(state, {categoryname}) {
      let dataList = [];
      dataList = [...state.subCategories][categoryname].subCategories;
      return {...state, dataList};
    },
    saveSelect(state, {selected}) {
      return {...state, selected}
    },
    saveLoading(state, {loading}) {
      return {...state, loading};
    }
  }
};
