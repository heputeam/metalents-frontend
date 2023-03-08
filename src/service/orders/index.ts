import axios from 'axios';
import { apis } from '..';
import { ICreateOrderParams } from './types';

// 创建订单
export function postOrderCreate(body: ICreateOrderParams): any {
  return axios.post(apis.order.create, { ...body });
}

// 查询订单详情
export function getOrderDetails(orderId: number): any {
  return axios.get(apis.order.details, {
    params: {
      orderId: orderId,
    },
  });
}

// 卖家更新订单交付文件
export function postUpdateOrderDeliverDocs(body: any): any {
  return axios.post(apis.order.updateFile, { ...body });
}

// 买家确认订单
export function postOrderComplete(body: any): any {
  return axios.post(apis.order.complete, { ...body });
}
// 取消订单
export function postOrderCancel(body: any): any {
  return axios.post(apis.order.cancel, { ...body });
}

// 查看订单取消详情
export function getOrderCancelDetails(params: any): any {
  return axios.get(apis.order.cancelDetails, {
    params: {
      orderId: params,
    },
  });
}

// 卖家回复买家的取消申请
export function postOrderSellerAccept(body: any): any {
  return axios.post(apis.order.sellerAccept, { ...body });
}

// 买家向客服申请取消订单
export function postSubmitCustomerService(body: any): any {
  return axios.post(apis.order.submitCustomerService, { ...body });
}

// 修改订单交付文件的可见性
export function postOrderPublic(body: any): any {
  return axios.post(apis.order.public, { ...body });
}

// 根据服务查询订单列表
export function getOrderFilter(body: any): any {
  return axios.post(apis.order.filter, { ...body });
}

// 查询当前是否可以创建订单
export function getOrderConfirmCheck(params: any): any {
  return axios.get(apis.order.confirm, {
    params: {
      ...params,
    },
  });
}
