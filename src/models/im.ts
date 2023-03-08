import { IImRoot } from '@/hooks/useIm';
import { Effect, Reducer } from 'umi';
import { getImtoken } from '@/service/im';

export const ImCacheKeys = {
  imToken: '_ps_im_token',
};
export interface IImState {
  imRoot?: IImRoot | null;
  imToken: string | null;
}

export interface IImReducers {
  saveImRoot: Reducer<IImState>;
  setSession: Reducer<IImState>;
}

export interface IImModelType {
  namespace: string;
  state: IImState;
  reducers: IImReducers;
  effects: {
    queryImtoken: Effect;
  };
}

const ImModel: IImModelType = {
  namespace: 'im',
  state: {
    imRoot: null,
    imToken: null,
  },
  effects: {
    *queryImtoken({}, { call, put }) {
      // try {
      //   const res = yield call(() => getImtoken());
      //   const { data } = res;
      //   yield put({
      //     type: 'setSession',
      //     payload: {
      //       imToken: data?.token,
      //     },
      //   });
      // } catch (err) {
      //   console.error('imtoken/error:', err);
      // }
    },
  },
  reducers: {
    saveImRoot(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    setSession(state, { payload }) {
      const { imToken } = payload;
      localStorage.setItem(ImCacheKeys.imToken, JSON.stringify(imToken));
      return {
        ...state,
        imToken,
      };
    },
  },
};

export default ImModel;
