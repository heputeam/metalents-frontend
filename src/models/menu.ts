import Toast from '@/components/Toast';
import { Errors } from '@/service/errors';
import { getMenus } from '@/service/general';
import { IMenuInfo } from '@/service/public/types';
import { Effect, Reducer, Subscription } from 'umi';

export interface IMenuState {
  menus: IMenuInfo[];
}
export interface IMenuReducers {
  setMenus: Reducer<IMenuState, { type: string; payload: IMenuState }>;
}
export interface IMenuEffects {
  queryMenus: Effect;
}
export interface IMenusModelType {
  namespace: 'menus';
  state: IMenuState;
  effects: IMenuEffects;
  reducers: IMenuReducers;
  subscriptions: { setup: Subscription };
}

const MenusModel: IMenusModelType = {
  namespace: 'menus',
  state: {
    menus: [],
  },
  effects: {
    *queryMenus({}, { call, put }: any): any {
      try {
        const res = yield call(() => getMenus());
        const { code, data } = res;
        yield put({
          type: 'setMenus',
          payload: {
            menus: data || [],
          },
        });
        if (code !== 200) {
          Toast.error(Errors[code]);
        }
      } catch (error) {
        console.log('getMenuInfo err', error);
      }
    },
  },
  reducers: {
    setMenus(state, { payload }) {
      return {
        ...state,
        menus: payload.menus,
      };
    },
  },
  subscriptions: {
    setup({ dispatch }) {
      dispatch({
        type: 'queryMenus',
      });
    },
  },
};

export default MenusModel;
