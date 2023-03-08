import { getWalletBalances } from '@/service/wallet';
import { IBalances } from '@/service/wallet/types';
import { Reducer, Effect, Subscription, IUserState } from 'umi';

export interface IWalletStateType {
  balances: IBalances | null;
  loading: boolean;
  coinBalance: {
    coinId: string;
  } | null;
}
export interface IWalletReducersType {
  setBalancesData: Reducer<
    IWalletStateType,
    { type: string; payload: IWalletStateType }
  >;
  setCoinBalance: Reducer<
    IWalletStateType,
    { type: string; payload: IWalletStateType }
  >;
  setLoading: Reducer<
    IWalletStateType,
    { type: string; payload: IWalletStateType }
  >;
}
export interface IWalletEffectsType {
  queryBalances: Effect;
}
export interface ITokenModelType {
  namespace: 'wallet';
  state: IWalletStateType;
  effects: IWalletEffectsType;
  reducers: IWalletReducersType;
}

const WalletModel: ITokenModelType = {
  namespace: 'wallet',
  state: {
    balances: null,
    coinBalance: null,
    loading: true,
  },
  effects: {
    *queryBalances({}, { call, put, select }) {
      yield put({
        type: 'setLoading',
        payload: {
          loading: true,
        },
      });
      const user = yield select((state: { user: IUserState }) => {
        return state.user;
      });
      if (!user.uid) {
        return false;
      }
      try {
        const res = yield call(() => getWalletBalances());
        const coinBalance = res?.data?.balances?.reduce(
          (acc: any, cur: any) => {
            acc[cur['coinId']] = cur['amount'];
            return acc;
          },
          {},
        );
        yield put({
          type: 'setBalancesData',
          payload: {
            balances: res?.data,
          },
        });
        yield put({
          type: 'setCoinBalance',
          payload: {
            coinBalance: coinBalance,
          },
        });
        yield put({
          type: 'setLoading',
          payload: {
            loading: false,
          },
        });
      } catch (err) {
        yield put({
          type: 'setLoading',
          payload: {
            loading: false,
          },
        });
        console.error('balances/error:', err);
      }
    },
  },
  reducers: {
    setLoading(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    setBalancesData(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    setCoinBalance(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};

export default WalletModel;
