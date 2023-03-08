import axios from 'axios';
import { AnySchema } from 'yup';
import { apis } from '..';
import { IActivityListParams, IActivityParams } from './type';

// 获取活动列表
export function getActivityList(params: IActivityListParams): any {
  return axios.post(apis.activity['list'], { ...params });
}

// 获取活动配置项
export function getActivityConfig(params: any): any {
  return axios.get(apis.activity['config'], {
    params: {
      ...params,
    },
  });
}

// 获取活动top_seller
export function getActivityTopSeller(params: any): any {
  return axios.get(apis.activity['top_seller'], {
    params: {
      ...params,
    },
  });
}

// 获取活动reward details
export function getActivityRewards(params: any): any {
  return axios.get(apis.activity['rewards'], {
    params: {
      ...params,
    },
  });
}

// 获取活动referrals
export function getActivityReferrals(params: any): any {
  return axios.get(apis.activity['referrals'], {
    params: {
      ...params,
    },
  });
}

// 获取活动dashboard
export function getActivityDashboard(): any {
  return axios.get(apis.activity['dashboard']);
}

// 活动奖励提现
export function postActivityWithdraw(): any {
  return axios.post(apis.activity['withdraw']);
}

// twitter转推
export function postActivityRetweet(accessToken: string): any {
  return axios.post(apis.activity['retweet'], { accessToken });
}

// 检查twitter是否转推成功
export function getActivityReweetStatus(): any {
  return axios.get(apis.activity['retweet_status'], {
    params: {},
  });
}
