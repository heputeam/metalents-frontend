import axios from 'axios';
import { apis } from '..';
import { IResponse } from '../types';

/**
 * 所有未归类接口
 */
//
export function emailCheck(email: string) {
  return axios.get(apis['/email_check'], {
    params: { email },
  });
}

export function getThirdpartCheck(type: any, value: any) {
  return axios.get(apis['/thirdpart_check'], {
    params: { type, value },
  });
}

export function getCoinsTokens(): any {
  return axios.get(apis['/coins/tokens'], {
    params: { tokenids: [] }, // 查询所有代币
  });
}

export function getUserNameCheck(name: string): any {
  return axios.get(apis['/username_check'], {
    params: { name },
  });
}

export function getServices(type: number): any {
  return axios.get(apis['/services'], { params: { id: type } });
}

export function getUserPosts(params: any): any {
  return axios.get(apis['/post/get_user_posts'], {
    params: { ...params },
  });
}

export function getShopnameCheck(shopname: string) {
  return axios.get(apis['/shopname_check'], {
    params: { shopname },
  });
}

export function postUpdateBanner(body: any): any {
  return axios.post(apis['/update_banner'], {
    ...body,
  });
}

export function postRegister(body: any): any {
  return axios.post(apis['/register'], { ...body });
}

export function postChangePwd(body: any): any {
  return axios.post(apis['/change_password'], { ...body });
}

export function postVerifyCode(email: string): any {
  return axios.post(apis['/verifycode'], { email });
}
export function postLogin(body: any): any {
  return axios.post(apis['/login'], { ...body });
}

export function postUpdateThirdpart(body: any): any {
  return axios.post(apis['/update_thirdpart'], { ...body });
}

export function postCreateOrUpdate(body: any): any {
  return axios.post(apis['/post/create_or_update'], { ...body });
}

export function postUpload(body: any): any {
  return axios.post<any, IResponse<any>>(apis['/fileupload'], body, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}
