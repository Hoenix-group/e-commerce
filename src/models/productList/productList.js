export default {
  namespace: 'productList',
  state: {
    isLoading: false,
    productsData: [
      {
        img: require('./../../../images/sale_product_01_280x190.png'),
        title: 'Apple iPhone 7 Plus (A1661) 128G 玫瑰金色 移动联通电信4G手机Apple iPhone 7 Plus (A1661) 128G 玫瑰金色 移动联通电信4G手机',
        des: '不是所有的兼职汪都需要风吹日晒',
        tabs: ['双卡', '32GB', '标签1'],
        price: '3688.00',
        online: 1, /* 1:"线上",0:"线下"*/
        num: 9,
      },
      {
        img: require('./../../../images/sale_product_02_280x190.png'),
        title: '荣耀 畅玩5C 全网通 高配版 3GB+32GB 落日金 移动联通电信4G手机 双卡双待荣耀 畅玩5C 全网通 高配版 3GB+32GB 落日金 移动联通电信4G手机 双卡双待',
        des: '不是所有的兼职汪都需要风吹日晒',
        tabs: ['单卡', '32GB', '标签1'],
        price: '3888.00',
        online: 0, /* 1:"线上",0:"线下"*/
        num: 0,
      },
      {
        img: require('./../../../images/sale_product_03_280x190.png'),
        title: 'OPPO R9s 全网通4G+64G 双卡双待手机 黑色OPPO R9s 全网通4G+64G 双卡双待手机 黑色OPPO R9s 全网通4G+64G 双卡双待手机 黑色OPPO R9s 全网通4G+64G 双卡双待手机 黑色',
        des: '不是所有的兼职汪都需要风吹日晒',
        tabs: ['双卡', '32GB', '标签1'],
        price: '3088.00',
        online: 0, /* 1:"线上",0:"线下"*/
        num: 33,
      },

      {
        img: require('./../../../images/sale_product_04_280x190.png'),
        title: 'Apple iPhone 7 Plus (A1661) 128G 玫瑰金色 移动联通电信4G手机Apple iPhone 7 Plus (A1661) 128G 玫瑰金色 移动联通电信4G手机Apple iPhone 7 Plus (A1661) 128G 玫瑰金色 移动联通电信4G手机',
        des: '不是所有的兼职汪都需要风吹日晒',
        tabs: ['双卡', '32GB', '标签1'],
        price: '3688.00',
        online: 1, /* 1:"线上",0:"线下"*/
        num: 155,
      },
      {
        img: require('./../../../images/sale_product_05_280x190.png'),
        title: '荣耀 畅玩5C 全网通 高配版 3GB+32GB 落日金 移动联通电信4G手机 双卡双待荣耀 畅玩5C 全网通 高配版 3GB+32GB 落日金 移动联通电信4G手机 双卡双待荣耀 畅玩5C 全网通 高配版 3GB+32GB 落日金 移动联通电信4G手机 双卡双待',
        des: '不是所有的兼职汪都需要风吹日晒',
        tabs: ['单卡', '32GB', '标签1'],
        price: '3888.00',
        online: 0, /* 1:"线上",0:"线下"*/
        num: 0,
      },
    ],

  },
  reducers: {
    changeType(state, action) {
      return { ...state, data: action.data };
    },
  },
  effects: {
    * fetchCarts({ userId }, { call, put }) {

    },
  },
};
