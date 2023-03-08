import Toast from '@/components/Toast';
import { Errors } from '@/service/errors';
import { getUserFavourite, getUserProfile } from '@/service/types';
import { Effect, Reducer, Subscription } from 'umi';
import hellojs from 'hellojs';
import { IOAuth, OAuthKeys } from '@/define';
import { postLogin } from '@/service/public';
import {
  IFavouriteSeller,
  IFovouriteService,
  IUserInfo,
} from '@/service/user/types';

export const CacheKeys = {
  token: '_ps_user_token',
  uid: '_ps_user_id',
  email: '_ps_user_email',
};
export interface IUserState {
  email: string | null;
  token?: string | null;
  uid?: number | null;
  userInfo?: IUserInfo;
  favServices?: IFovouriteService[] | null;
  favSellers?: IFavouriteSeller[] | null;
}
export interface IUserEffects {
  queryUser: Effect;
  login: Effect;
  logout: Effect;
  loginOAuth: Effect;
  queryFavouriteServices: Effect;
  queryFavouriteSellers: Effect;
}
export interface IUserReducers {
  setUser: Reducer<IUserState>;
  setFavouriteServices: Reducer<IUserState>;
  setFavouriteSellers: Reducer<IUserState>;
  setSession: Reducer<IUserState, any>;
}
export interface IUserModelType {
  namespace: 'user';
  state: IUserState;
  effects: IUserEffects;
  reducers: IUserReducers;
  subscriptions: {
    setup: Subscription;
  };
}
type IThirdpartType = 2 | 3 | 4;
export interface IOAuthResponse {
  accessToken: string;
  message: string;
  signature: string;
  thirdpartType: IThirdpartType; // 第三方类型(2:gmail,3:twitter,4:ins,5:metamask)
  userAddress: string;
}

const AuthProps: {
  [key in IOAuth]: {
    thirdpartType: IThirdpartType;
    [key: string]: any;
  };
} = {
  google: {
    thirdpartType: 2,
    scope: 'email',
  },
  twitter: {
    thirdpartType: 3,
  },
  instagram: {
    thirdpartType: 4,
    response_type: 'code',
    scope: 'basic,user_profile',
  },
};

const UserModel: IUserModelType = {
  namespace: 'user',
  state: {
    email: JSON.parse(localStorage.getItem(CacheKeys.email) as string),
    uid: null,
    token: null,
    favServices: null,
    favSellers: null,
  },
  effects: {
    /**
     * 第三方登录
     */
    *loginOAuth({ payload, callback }, { call }) {
      const { authName, authParams } = payload;
      const { thirdpartType, ..._pms } = AuthProps[authName as IOAuth];
      try {
        const response = yield call(() =>
          hellojs(authName).login({ ..._pms, ...authParams }),
        );
        const accessToken = response?.authResponse?.access_token || '';
        console.log(
          `oauth login: ${authName}, response=>`,
          response?.authResponse,
        );
        callback({
          accessToken,
          message: '',
          signature: '',
          thirdpartType: thirdpartType, // 第三方类型(2:gmail,3:twitter,4:ins,5:metamask)
          userAddress: '',
        });
      } catch (err) {
        console.log('oauth login error:', err);
      }
    },
    /**
     * 常规登录
     */
    *login({ payload }, { call, put }) {
      const { params, callback } = payload;
      const response = yield call(() => postLogin({ ...params }));
      const { code, data, token, ...rest } = response;
      callback?.({ code, data, rest });
      if (code === 30011) {
        return Toast.error(Errors[code]);
      }
      if (code === 30012) {
        return Toast.error(Errors[code]);
      }
      if (code === 30055) {
        return Toast.error(
          'Your account is disabled. Please contact Metalents Customer Service.',
        );
      }
      if (code !== 200) {
        return Toast.error('Incorrect log in details. Please try again.');
      }
      yield put({
        type: 'setSession',
        payload: {
          token,
          uid: data.id,
          email: data.email,
        },
      });

      yield put({
        type: 'setUser',
        payload: {
          userInfo: data,
        },
      });
      yield put({
        type: 'im/queryImtoken',
        payload: {},
      });
    },
    *logout({}, { put }) {
      yield put({
        type: 'setUser',
        payload: {
          userInfo: {},
        },
      });
      yield put({
        type: 'setSession',
        payload: {
          token: null,
          uid: null,
        },
      });
    },
    *queryUser({}, { call, put, select }) {
      const user = yield select((state: { user: IUserState }) => {
        return state.user;
      });
      try {
        const res = yield call(() => getUserProfile(user.uid));
        const { code, data } = res;
        if (code === 200) {
          yield put({
            type: 'setUser',
            payload: {
              userInfo: data,
            },
          });
          yield put({
            type: 'wallet/queryBalances',
          });
        } else {
          Toast.error(Errors[code]);
        }
      } catch (error) {
        console.log('getUserInfo err', error);
      }
    },
    *queryFavouriteServices({}, { call, put, select }) {
      const user = yield select((state: { user: IUserState }) => {
        return state.user;
      });
      try {
        const res = yield call(() =>
          getUserFavourite({
            offset: 0,
            pageSize: 50,
            type: 2,
            userId: user.uid,
          }),
        );

        const { code, data } = res;

        if (code === 200 && data.services) {
          yield put({
            type: 'setFavouriteServices',
            payload: {
              favServices: data.services,
            },
          });
        } else {
          if (code !== 200) {
            Toast.error(Errors[code]);
          }

          yield put({
            type: 'setFavouriteServices',
            payload: {
              favServices: [],
            },
          });
        }
      } catch (error) {
        console.log('get favourite services err', error);
      }
    },
    *queryFavouriteSellers({ payload }, { call, put, select }) {
      const user = yield select((state: { user: IUserState }) => {
        return state.user;
      });

      try {
        const res = yield call(() =>
          getUserFavourite({
            offset: 0,
            pageSize: 50,
            type: 1,
            userId: user.uid,
          }),
        );

        const { code, data } = res;

        if (code === 200 && data.users) {
          yield put({
            type: 'setFavouriteSellers',
            payload: {
              favSellers: data.users,
            },
          });
        } else {
          if (code !== 200) {
            Toast.error(Errors[code]);
          }

          yield put({
            type: 'setFavouriteSellers',
            payload: {
              favSellers: [],
            },
          });
        }
      } catch (error) {
        console.log('get favourite sellers err', error);
      }
    },
  },
  reducers: {
    setSession(state, { payload }) {
      const { uid, token, email } = payload;
      const _email = email || state?.email || '';
      localStorage.setItem(CacheKeys.token, JSON.stringify(token));
      localStorage.setItem(CacheKeys.uid, JSON.stringify(uid));
      localStorage.setItem(CacheKeys.email, JSON.stringify(_email));

      return {
        ...state,
        uid,
        token,
        email: _email,
      };
    },
    setUser(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    setFavouriteServices(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    setFavouriteSellers(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },

  subscriptions: {
    setup({ dispatch }) {
      // 后台返回
      const token = JSON.parse(localStorage.getItem(CacheKeys.token) as string);
      const uid = JSON.parse(localStorage.getItem(CacheKeys.uid) as string);
      if (uid) {
        // 本身就是从缓存取出来，不需要再次存入
        dispatch({
          type: 'setUser',
          payload: {
            uid,
            token,
          },
        });
      }

      hellojs.init(
        {
          ...OAuthKeys,
        },
        {
          redirect_uri: '/',
        },
      );
    },
  },
};

export default UserModel;
