import { Effect, Reducer } from 'umi';

export interface IDialogState {
  visible: boolean;
  registerType: number;
  assessToken: string;
  message: string;
  signature: string;
  userAddress: string;
  callback?: (res: any) => void;
  [key: string]: any;
}

export type IDialogStateType = Record<string, IDialogState>;
export interface IDialogEffects {
  show: Effect;
  hide: Effect;
}

export interface IDialogReducers {
  setDialogModel: Reducer<IDialogStateType>;
}

export interface IDialogType {
  namespace: 'dialog';
  state: IDialogStateType;
  effects: IDialogEffects;
  reducers: IDialogReducers;
}

const DialogModel: IDialogType = {
  namespace: 'dialog',
  state: {},
  effects: {
    *show({ payload }, { put }) {
      yield put({
        type: 'setDialogModel',
        payload: { ...payload, visible: true },
      });
    },
    *hide({ payload }, { put }) {
      yield put({
        type: 'setDialogModel',
        payload: { ...payload, visible: false, callback: null },
      });
    },
  },
  reducers: {
    // 设置弹窗显示
    setDialogModel(state, { payload: { key, ...rest } }) {
      const newState = { ...state };
      newState[key] = rest;
      return newState;
    },
  },
};

export default DialogModel;
