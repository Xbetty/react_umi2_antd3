import * as serv from '../services/index';
export default {
  namespace: 'userInfo',

  state: {},

  subscriptions: {
    setup({ dispatch, history }) {
      // 监听路由的变化，请求页面数据
      return history.listen(({ pathname, state }) => {
        if (pathname === '/home') {
          dispatch({ type: 'GetList' });
        }
      });
    },
  },

  effects: {
    *GetList({ payload }, { call, put, select }) {
      let res = yield call(serv.GetList);
      console.log('res',res)
    },
  },

  reducers: {
    updateState(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
