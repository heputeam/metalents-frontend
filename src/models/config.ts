import { getSysconfig } from '@/service/sysConfig';
import { IConfig } from '@/service/sysConfig/types';
import { Reducer, Effect, Subscription } from 'umi';

export interface IConfigStateType {
  config: IConfig | null;
}
export interface IConfigReducersType {
  setConfig: Reducer<
    IConfigStateType,
    { type: string; payload: IConfigStateType }
  >;
}
export interface IConfigEffectsType {
  querySysConfig: Effect;
}
export interface IConfigModelType {
  namespace: 'config';
  state: IConfigStateType;
  effects: IConfigEffectsType;
  reducers: IConfigReducersType;
  subscriptions: { setup: Subscription };
}

const ConfigModel: IConfigModelType = {
  namespace: 'config',
  state: {
    config: null,
  },
  effects: {
    *querySysConfig({}, { call, put }) {
      try {
        const res = yield call(() => getSysconfig());
        const result = res?.data?.list?.reduce((acc: any, cur: any) => {
          acc[cur['cfgName']] = cur;
          return acc;
        }, {});
        yield put({
          type: 'setConfig',
          payload: {
            config: result,
          },
        });
      } catch (err) {
        console.error('sysConfig/error:', err);
      }
    },
  },
  reducers: {
    setConfig(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
  subscriptions: {
    setup({ dispatch }) {
      dispatch({
        type: 'querySysConfig',
      });
    },
  },
};

export default ConfigModel;
