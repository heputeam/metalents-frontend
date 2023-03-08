import { getOrderReasons } from '@/service/general';
import { IOrderReasonRes } from '@/service/general/types';
import { Effect, Reducer, Subscription } from 'umi';

export interface IOrderReasonsReducers {
  setOrderReasons: Reducer<
    IOrderReasonsState,
    {
      type: string;
      payload: IOrderReasonsState;
    }
  >;
}

export interface IOrderReasonsEffects {
  queryOrderReasons: Effect;
}

export interface IOrderReasonsState {
  orderReasons: IOrderReasonRes | null;
}

export interface IOrderReasonsModelType {
  namespace: 'orderReasons';
  state: IOrderReasonsState;
  effects: IOrderReasonsEffects;
  reducers: IOrderReasonsReducers;
  subscriptions: { setup: Subscription };
}

const OrderReasonsModel: IOrderReasonsModelType = {
  namespace: 'orderReasons',
  state: {
    orderReasons: null,
  },
  effects: {
    *queryOrderReasons({}, { call, put }) {
      try {
        const res = yield call(() => getOrderReasons());
        const result = res?.data?.list;
        yield put({
          type: 'setOrderReasons',
          payload: {
            orderReasons: result,
          },
        });
      } catch (err) {
        console.error('getOrderReasons/error:', err);
      }
    },
  },
  reducers: {
    setOrderReasons(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
  subscriptions: {
    setup({ dispatch }) {
      dispatch({
        type: 'queryOrderReasons',
      });
    },
  },
};

export default OrderReasonsModel;
