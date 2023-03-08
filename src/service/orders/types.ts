import { IFile } from '@/types';

// 订单状态
export enum ORDER_STATUS {
  Waiting = 'waiting', //未支付，等待支付, 前端手动加的状态
  Paid = 'paid', // 已支付,
  Delivery = 'delivery', // 卖家已交付,
  Complete = 'complete', // 买家已确认,
  Autocomplete = 'autocomplete', // 自动确认,
  Cancel = 'cancel', //订单已取消,
  Applycancel = 'applycancel', // 买家申请取消订单,
  Applycustomer = 'applycustomer', // 买家申请客服,

  // Waiting = 0, // 未支付，等待支付
  // Progress = 1, //正在进行中, 订单已支付
  // Review = 2, //卖家已交付, (卖家已经提交了作品)
  // Completed = 3, // 买家确认收货, 订单完成
  // TimeOut = 4, //订单超时, 超过订单约定时间，还有5天的倒计时
  // Canceled = 5, // 订单已取消
  // ReviewCanceling = 6, //卖家已交付, 但买家申请取消中
  // Customering = 7, //订单已提交客服处理
  // TimeOutCanceled = 8, //逾期订单,订单被自动取消
}

export interface ILeftTimeDiff {
  days: number;
  firstDateWasLater: boolean;
  hours: number;
  minutes: number;
  months: number;
  seconds: number;
  years: number;
}

export enum ORDER_REASON_TYPE {
  seller_cancel = 'seller_cancel', // 未交付情况下卖家申请取消原因
  buyer_cancel = 'buyer_cancel', // 未交付情况下买家申请取消原因
  apply_buyer_cancel = 'apply_buyer_cancel', //  已交付情况下申请取消的原因
  apply_customer_service = 'apply_customer_service', // 申请客服处理原因,
  overdue_cancel = 'overdue_cancel', // 逾期状态下买家取消
}

// 创建订单的类型

export enum OrderCreateType {
  'service' = 1,
  'request' = 2,
}

export interface ICreateOrderParams {
  description: string;
  fiels: IFile[];
  proId: number;
  proType: number;
  verifyCode: string;
}

export interface IOrderDetailsRes {
  budget: string;
  budgetAmount?: string;
  buyerAvatar: IFile;
  buyerCancelAt: number;
  buyerId: number;
  buyerName: string;
  coinId: number;
  comment: string;
  createdAt: number;
  customerServiceReplyAt: number;
  deliverDocs: IFile[];
  deliverTime: number;
  description: string;
  fileDisplay: true;
  files: IFile[];
  id: number;
  modifyAt: number;
  paymentId: number;
  proId: number;
  proType: number;
  scope: number;
  sellerAvatar: IFile;
  sellerDeliverAt: number;
  sellerFirstDeliverAt: number;
  sellerId: number;
  sellerName: string;
  sellerIsVerify: string;
  sellerReplyAt: number;
  servicePosts: IFile[];
  serviceTitle: string;
  status: string;
  subServiceLevel: number;
  submissionCustomerServiceAt: number;
  txFee: string;
  txHash: string;
  txChainId: number;
  usdAmount: string;
  category: string;
  subcategory: string;
}

export interface IOrderCancelDetailsRes {
  createdAt: number;
  message: string;
  modifyAt: number;
  orderId: number;
  reasonId: number;
  reasonPosts: IFile[] | null;
  status: string;
  userId: number;
}

export interface IOrderFilterItem {
  budgetAmount: string;
  buyerAvatar: IFile;
  buyerId: number;
  buyerName: string;
  createdAt: number;
  modifyAt: number;
  orderId: number;
  status: ORDER_STATUS;
  usdAmount: string;
  coinId: number;
}
export interface IOrderFilter {
  list: IOrderFilterItem[];
  total: number;
}

export interface IOrderConfirmCheck {
  success: boolean;
}
