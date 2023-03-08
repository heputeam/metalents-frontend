import axios from 'axios';
import { apis } from '..';

export function getServiceDetail(
  serviceId: number,
  subServiceId?: number,
): any {
  return axios.get(apis.services.detail, {
    params: {
      serviceId,
      subServiceId,
    },
  });
}

export function getServiceByMain(serviceId: number): any {
  return axios.get(apis.services['sub/by_main_service'], {
    params: {
      serviceId,
    },
  });
}

export function getServiceComments(params: any): any {
  return axios.get(apis.services.comments, {
    params: {
      ...params,
    },
  });
}

export function getServiceOrders(params: any): any {
  return axios.post(apis.services.orders, {
    ...params,
  });
}

export function postServiceMainCreateOrUpdate(body: any): any {
  return axios.post(apis.services['main/create_or_update'], { ...body });
}

export function postServiceMainUpdate(serviceId: string, status: any): any {
  return axios.post(apis.services['main/update'], { serviceId, status });
}

export function postServiceSubCreateOrUpdate(body: any): any {
  return axios.post(apis.services['sub/create_or_update'], { ...body });
}
