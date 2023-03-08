import axios from 'axios';
import { apis } from '..';
import { ISearchServicesParams } from './types';

export function searchServices(params: ISearchServicesParams): any {
  return axios.post(apis.general['search/services'], { ...params });
}

export function getSearch(keyword: string): any {
  return axios.get(apis.general.search, { params: { keyword } });
}

export function getMenus(): any {
  return axios.get(apis.general.menu, {
    params: {},
  });
}

export function getBanners(type: number): any {
  return axios.get(apis.general.get_banner, { params: { type } });
}

export function postSearchServices(body: any): any {
  return axios.post(apis.general['search/services'], { ...body });
}

export function postSearchRequests(body: any): any {
  return axios.post(apis.general['search/requests'], {
    ...body,
  });
}

// 取消订单原因
export function getOrderReasons(): any {
  return axios.get(apis.general.reasons, { params: {} });
}

// 获取文件上传的配置
export function getFileConfig(): any {
  return axios.get(apis.general.file_config, { params: {} });
}
