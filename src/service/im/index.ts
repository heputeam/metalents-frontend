import axios from 'axios';
import { apis } from '..';

export function getImtoken(params?: any): any {
  return axios.get(apis.im['get_token'], { ...params });
}

export function getCloumnInfo(params?: any): any {
  return axios.post(apis.im['get_cloumn_info'], { ...params });
}
