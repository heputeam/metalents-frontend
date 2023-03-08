import axios from 'axios';
import { Errors, IErrorNo } from './errors';
import { getDvaApp, history } from 'umi';
import { Toast } from '@/components/Toast';
import { CacheKeys } from '@/models/user';
import { ImCacheKeys } from '@/models/im';
import { IResponse } from './types';
import _apis from './apis.json';

export const apis = _apis;

// axios 默认配置.

// 包含ccian或者localhost本地环境是测试环境，否则是正式环境
axios.defaults.baseURL =
  window.location?.host?.includes('test') ||
  window.location?.host?.includes('localhost') ||
  window.location?.host?.includes('192')
    ? 'https://api-test.metalents.com/api/v1'
    : 'https://apis.metalents.com/api/v1';

//   axios.defaults.baseURL =
// window.location?.host?.includes('ccian') ||
// window.location?.host?.includes('localhost')
//   ? 'https://api-freelancer-stage.ccian.cc/api/v1'
//   : 'https://apis.metalents.com/api/v1';

// 对请求数据过滤
axios.interceptors.request.use((config: any) => {
  const token = getDvaApp()._store.getState()?.user?.token;
  const headersCommon: any = {
    Accept: 'application/json',
  };
  if (token) {
    headersCommon['token'] = token;
  }

  config.headers.common = { ...headersCommon };

  return config;
});

// 对返回数据过滤
axios.interceptors.response.use(
  ({ status, data, headers }) => {
    const code = data.code as IErrorNo;
    const msg = Errors[code] || Errors['*'];
    let res: IResponse<any> = { code, msg, data: data.data || null };
    if (code !== 200) {
      console.error('request error:', msg);
    }
    if (headers.token) {
      res['token'] = headers.token;
    }
    return res;
  },
  ({ response: { status, data } }) => {
    console.error('request error:', status, data);

    // no auth.
    if (status === 401) {
      // 之前的请求响应

      Toast.error('Login has expired, please login again.', {
        toastId: 'toastId',
      });
      localStorage.setItem(CacheKeys.token, JSON.stringify(null));
      localStorage.setItem(CacheKeys.uid, JSON.stringify(null));
      localStorage.setItem(ImCacheKeys.imToken, JSON.stringify(null));
      history.push('/');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
    if (data.code === 30055) {
      Toast.error(
        'Your account is disabled. Please contact Metalents Customer Service.',
        {
          toastId: 'account',
        },
      );
      localStorage.setItem(CacheKeys.token, JSON.stringify(null));
      localStorage.setItem(CacheKeys.uid, JSON.stringify(null));
      localStorage.setItem(ImCacheKeys.imToken, JSON.stringify(null));
      history.push('/');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }

    return Promise.reject(data);
  },
);
