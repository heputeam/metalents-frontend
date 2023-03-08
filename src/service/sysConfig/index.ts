import axios from 'axios';
import { apis } from '..';

export function getSysconfig(): any {
  return axios.get(apis.sysConfig.sysconfig, { params: {} });
}
