import { getCoinsTokens } from '@/service/public';
import { ITokens } from '@/service/services/types';
import { Reducer, Effect, Subscription } from 'umi';

export interface ITokenStateType {
  tokens: ITokens | null;
  currency: ITokens | null;
}
export interface ITokenReducersType {
  setTokenData: Reducer<
    ITokenStateType,
    { type: string; payload: ITokenStateType }
  >;
  setCurrencyData: Reducer<
    ITokenStateType,
    { type: string; payload: ITokenStateType }
  >;
}
export interface ITokenEffectsType {
  queryTokens: Effect;
}
export interface ITokenModelType {
  namespace: 'coins';
  state: ITokenStateType;
  effects: ITokenEffectsType;
  reducers: ITokenReducersType;
  subscriptions: { setup: Subscription };
}

const TokenModel: ITokenModelType = {
  namespace: 'coins',
  state: {
    tokens: null,
    currency: null,
  },
  effects: {
    *queryTokens({}, { call, put }) {
      try {
        const res = yield call(() => getCoinsTokens());
        const result1 = res?.data?.list?.reduce((acc: any, cur: any) => {
          acc[cur['symbol']] = cur;
          return acc;
        }, {});
        const result2 = res?.data?.list?.reduce((acc: any, cur: any) => {
          acc[cur['id']] = cur;
          return acc;
        }, {});
        yield put({
          type: 'setTokenData',
          payload: {
            tokens: result1,
          },
        });
        yield put({
          type: 'setCurrencyData',
          payload: {
            currency: result2,
          },
        });
      } catch (err) {
        console.error('coins/error:', err);
      }
    },
  },
  reducers: {
    setTokenData(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    setCurrencyData(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
  subscriptions: {
    setup({ dispatch }) {
      dispatch({
        type: 'queryTokens',
      });
    },
  },
};

export default TokenModel;
