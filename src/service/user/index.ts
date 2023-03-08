import axios from 'axios';
import { apis } from '..';
import { IPageResponse, IResponse } from '../types';
import {
  IExperienceRequest,
  IGetUserOrdersData,
  IGetUserOrdersParams,
  IGetUserFinalpostsData,
  IGetUserFinalpostsParams,
} from './types';

export function getExperience(params: IExperienceRequest): any {
  return axios.get(apis.user.experience, {
    params: { ...params },
  });
}

export function getUserRequestsOffers(params: any): any {
  return axios.get(apis.user['requests/offers'], { params: { ...params } });
}

export function getUserOffers(params: any): any {
  return axios.get(apis.user.offers, { params: { ...params } });
}

export function getUserProfile(uid: string | number): any {
  return axios.get(apis.user.profile, {
    params: {
      userId: uid,
    },
  });
}

export function getUserFavourite(params: any): any {
  return axios.get(apis.user.favourite, {
    params: { ...params },
  });
}

export function postUserUpdate(body: any): any {
  return axios.post(apis.user.update, { ...body });
}

export function postUserFollowUser(following: boolean, userId: number): any {
  return axios.post(apis.user.follow_user, {
    following,
    userId,
  });
}

export function postUserFollowService(
  following: boolean,
  serviceId: number,
): any {
  return axios.post(apis.user.follow_service, {
    following,
    serviceId,
  });
}

export function postUserRequests(body: any): any {
  return axios.post(apis.user.requests, { ...body });
}

export function postUserUpdateExperience(body: any): any {
  return axios.post(apis.user.update_experience, { ...body });
}

export function postUserServices(body: any): any {
  return axios.post(apis.user.services, { ...body });
}

export function getUserOrders(
  body: IGetUserOrdersParams,
): Promise<IResponse<IGetUserOrdersData>> {
  return axios.post(apis.user.orders, { ...body });
}

export const getUserFinalPosts = async (
  params: IGetUserFinalpostsParams,
): Promise<IResponse<IGetUserFinalpostsData>> => {
  return axios.get(apis.user.final_posts, {
    params: { ...params },
  });
};

export function postUserOrders(params: any): any {
  return axios.post(apis.user.orders, { ...params });
}
