import axios from 'axios';
import { apis } from '..';

export function getOffersCanCreate(requestId: number): any {
  return axios.get(apis.offers.can_create, { params: { requestId } });
}

export function postOffersUpdate(body: any): any {
  return axios.post(apis.offers.update, { ...body });
}

export function postOffersCreateOfUpdate(body: any): any {
  return axios.post(apis.offers.create_or_update, { ...body });
}
