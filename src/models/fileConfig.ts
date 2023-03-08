import { getFileConfig } from '@/service/general';
import { IFileConfig } from '@/service/general/types';
import { Reducer, Effect, Subscription } from 'umi';

export interface IFileConfigStateType {
  fileConfig: IFileConfig | null;
}
export interface IFileConfigReducersType {
  setFileConfig: Reducer<
    IFileConfigStateType,
    { type: string; payload: IFileConfigStateType }
  >;
}
export interface IFileConfigEffectsType {
  queryFileConfig: Effect;
}
export interface IConfigModelType {
  namespace: 'fileConfig';
  state: IFileConfigStateType;
  effects: IFileConfigEffectsType;
  reducers: IFileConfigReducersType;
  subscriptions: { setup: Subscription };
}

const ConfigModel: IConfigModelType = {
  namespace: 'fileConfig',
  state: {
    fileConfig: null,
  },
  effects: {
    *queryFileConfig({}, { call, put }) {
      try {
        const res = yield call(() => getFileConfig());
        const result = res?.data?.reduce((acc: any, cur: any) => {
          acc[cur['relateService']] = cur;
          return acc;
        }, {});
        yield put({
          type: 'setFileConfig',
          payload: {
            fileConfig: result,
          },
        });
      } catch (err) {
        console.error('queryFileConfig/error:', err);
      }
    },
  },
  reducers: {
    setFileConfig(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
  subscriptions: {
    setup({ dispatch }) {
      dispatch({
        type: 'queryFileConfig',
      });
    },
  },
};

export default ConfigModel;
