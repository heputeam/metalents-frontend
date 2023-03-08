import axios from 'axios';
import { apis } from '..';

export function getCanCreate(): any {
  return axios.get(apis.requests.can_create, {});
}

export function getRequestsDetail(params: any): any {
  return axios.get(apis.requests.details, { params: { ...params } });
}

export function postRequestsCreate(body: any): any {
  return axios.post(apis.requests.create, { ...body });
}

export function postRequestsHidden(body: any): any {
  return axios.post(apis.requests.hidden, { ...body });
}

export function postRequestsCancel(body: any): any {
  return axios.post(apis.requests.cancel, { ...body });
}
