import { IFile } from '@/types';
import { NetworkChain } from '@/web3/chains';
import { ORDER_STATUS } from '../orders/types';
import { ISubServiceInfo } from '../services/types';
import { IPagerData, IPageResponse, IPagerRequest } from '../types';

export type UID = number;

export enum ExperienceType {
  ALL,
  EDUCATION,
  WORK,
}

export interface IUpdateExperienceParams {
  experience: {
    description: string;
    endTime: number;
    id: number;
    industry: string;
    location: string;
    startTime: number;
    type: ExperienceType;
  }[];
}

export interface IExperience {
  description: string;
  endTime: string;
  id: number;
  industry: string;
  location: string;
  modifyLeftTimes: number;
  modifyTimes: number;
  startTime: string;
  type: ExperienceType;
  userId: number;
}
export interface IExperienceRequest {
  userId: UID;
  type: ExperienceType;
  t?: number;
}

export interface ILoginReq {
  accessToken: string;
  email: string;
  loginType: number;
  message: string;
  password: string;
  signature: string;
  userAddress: string;
}

export interface IMediaItem {
  avatar: string;
  name: string;
}
export interface IUserInfo {
  email: string;
  avatar: IFile;
  banner?: string;
  career: string;
  company: string;
  shopname: string;
  description: string;
  focused: number[];
  followerCount?: number;
  googleInfo?: IMediaItem;
  instagramInfo?: IMediaItem;
  instagramLink: string;
  id: number;
  levels?: number;
  location: string;
  modifyLeftTimes?: number;
  modifyTimes?: number;
  timezone: string;
  twitterInfo?: IMediaItem;
  twitterLink: string;
  userBalance?: string;
  userName: string;
  userType?: number;
  walletAddress?: string;
  createdAt?: number;
  passwordSet?: boolean;
  bond: string;
  status: number;
  scope: number;
  orderCount: number;
  offerCount: number;
  hdWalletAddress?: string;
  isVerify?: string;
  website: string;
}

export interface IUpdateUserInfoParams {
  avatar: string;
  career: string;
  company: string;
  description: string;
  focused: number[];
  instagramLink: string;
  location: string;
  timezone: string;
  twitterLink: string;
  userName: string;
  email?: string;
  shopname?: string;
  website: string;
}

// 用户账户状态
export enum UserStatus {
  NORMAL = 1,
  DISABLE = 2,
  DISABLE_BUYER = 3,
  DISABLE_SELLER = 4,
}

// 需求状态
export enum ERequestStatus {
  all,
  waiting,
  completed,
  close,
  disable,
}

/**
 * /user/requests的参数
 */
export interface IGetUserRequestsParams {
  offset: number;
  pageSize: number;
  status?: ERequestStatus;
}

export interface IUserRequest {
  budgetAmount: string;
  category: string;
  coinId: number;
  createdAt: number;
  deliverTime: number;
  description: string;
  hidden: UserRequestsVisibility;
  modifyAt: number;
  offerCount: number;
  requestId: number;
  status: ERequestStatus;
  subcategory: string;
  orderId: number;
}

// 投标状态
export enum EOfferStatus {
  all,
  waiting,
  accepted,
  rejected,
  cancel,
}

/**
 * /user/requests的响应，插入all字段，all的值为total
 */
export interface IGetUserRequestsResp {
  hidden: number;
  list: IUserRequest[];
  overview: {
    all: number;
    close: number;
    completed: number;
    disable: number;
    waiting: number;
  };
  total: number;
}

/**
 * user/offers的参数
 */
export interface IGetUserOffersParams {
  offset: number;
  pageSize: number;
  status?: EOfferStatus;
  requestId?: number; // 查用户下某个需求下的offers时传入
}

export interface IUserOffer {
  budgetAmount: string;
  coinId: number;
  createdAt: number;
  deliverTime: number;
  description: string;
  id: number;
  modifyAt: number;
  reqCreatedAt: number;
  reqDeliverTime: number;
  reqDescription: string;
  reqModifyAt: number;
  requestId: number;
  reqStatus: ERequestStatus;
  status: number;
  userId: number;
}

/**
 * /user/offers的响应，插入all字段，all的值为total
 */
export interface IGetUserOffersResp {
  list: IUserOffer[];
  overview: {
    all: number;
    accepted: number;
    cancel: number;
    rejected: number;
    waiting: number;
  };
  total: number;
}

export interface IFovouriteService {
  service_id: number;
  posts: IFile[];
  scope: number;
  subServices: ISubServiceInfo[];
  title: string;
}

// 关注服务列表
export interface IFavouriteServiceRes {
  services: IFovouriteService[];
  total: number;
}

export interface IFavouriteSeller {
  avatar: IFile;
  created_at: number;
  levels: number;
  scope: number;
  sellerID: number;
  shopname: string;
}

// 关注卖家列表
export interface IFavouriteSellerRes {
  total: number;
  users: IFavouriteSeller[];
}

//  1 头像， 2 作品集，3 服务的介绍图片 4 交付的订单图片 5 用户封面 6 需求的介绍图片
export enum EPostType {
  avatar = 1,
  portfolio,
  service,
  order,
  userBanner,
  request,
}

export interface IClearPostParams {
  posts: [{ id: -1; type: EPostType }];
}

export interface IUpdatePostParams {
  posts: IFile[];
}

export interface IUpdatePostRespData {
  list: IFile[] | null;
  total: number;
}

export interface IRequestDetails {
  avatar: string;
  budgetAmount: string;
  budgetToken: string;
  coinId: number;
  category: string;
  createdAt: number;
  deliverTime: number;
  description: string;
  id: number;
  levels: number;
  modifyAt: number;
  offerCount: number;
  postids: string;
  posts?: IFile[] | null;
  status: number;
  subcategory: string;
  userAvatar: IFile;
  userId: number;
  userName: string;
}

/**
 * 用户的需求在市场上是否可见
 * @enum
 */
export enum UserRequestsVisibility {
  SHOW = 1,
  HIDDEN = 2,
}

/**
 * 切换用户的需求在市场上是否可见，
 * 目前只允许改变completed和closed状态的需求
 */
export interface IToggleRequestsVisiblityParams {
  hidden: UserRequestsVisibility;
  status: [2, 3];
}

export interface IOtherOffersItem {
  avatar: string;
  budgetAmount: string;
  coinId: number;
  budgetToken: string;
  createdAt: number;
  deliverTime: number;
  description: string;
  id: number;
  levels: number;
  modifyAt: number;
  requestId: number;
  status: number;
  userAvatar: IFile;
  userId: number;
  userName: string;
  orderId: number;
  userIsVerify: string;
}
export interface IOtherOffers {
  list: IOtherOffersItem[];
  total: number;
}

export interface IUserOffers {
  list: IUserOffersItem[];
  overview?: IOverview;
  total: number;
}
export interface IUserOffersItem {
  budgetAmount: string;
  coinId: number;
  budgetToken: string;
  createdAt: number;
  deliverTime: number;
  description: string;
  id: number;
  modifyAt: number;
  reqCreatedAt: number;
  reqDeliverTime: number;
  reqDescription: string;
  reqModifyAt: number;
  requestId: number;
  status: number;
  userId: number;
  orderId: number;
}
export interface IOverview {
  accepted: number;
  cancel: number;
  rejected: number;
  waiting: number;
}

export type TOrderStatus =
  | 'progress'
  | 'review'
  | 'completed'
  | 'cancelled'
  | '';

/**
 * /user/orders的参数
 */
export interface IGetUserOrdersParams extends IPagerRequest {
  pageSize: number;
  offset: number;
  status: ORDER_STATUS[] | [];
  seller: boolean;
  sortBy: string;
  startTime?: number;
  endTime?: number;
}

export interface IGetUserOrdersOptionParams extends IPagerRequest {
  pageSize: number;
  offset: number;
  status: {
    val: ORDER_STATUS[] | [];
    valLabel: string;
  };
  seller: boolean;
  sortBy: string;
  startTime?: number;
  endTime?: number;
}
export interface IOrder {
  budgetAmount: string;
  buyerAvatar: IFile;
  buyerCancelAt: number;
  buyerId: number;
  buyerName: string;
  coinId: number;
  coinPrice: string;
  comment: string;
  createdAt: number;
  customerServiceReplyAt: number;
  deliverDocs: IFile[];
  deliverTime: number;
  description: string;
  id: number;
  scope: number;
  sellerAvatar: IFile;
  sellerDeliverAt: number;
  sellerId: number;
  sellerName: string;
  sellerReplyAt: number;
  servicePosts: IFile[];
  serviceTitle: string;
  status: string;
  subServiceLevel: number;
  submissionCustomerServiceAt: number;
  txFee: string;
  txChainId: number;
}

/**
 * /user/orders返回的数据
 */
export interface IGetUserOrdersData extends IPagerData<IOrder> {
  overview: {
    cancelled: number;
    completed: number;
    progress: number;
    review: number;
    ''?: number;
  };
}

/**
 * /user/final_posts的参数
 */
export interface IGetUserFinalpostsParams {
  offset: number;
  orderId: number;
  pageSize: number;
}

export interface IFinalPostChainInfo {
  chainId: NetworkChain;
  status: 'minted' | 'minting' | 'mint_failed';
  txHash: string;
}

export type TFinalPostStatus =
  | 'uploading'
  | 'uploaded'
  | 'upload_failed'
  | 'minting'
  | 'minted'
  | 'mint_failed'
  | ''; // 未上传时返回空字符串;

export interface IFinalPost {
  arweaveUrl: string;
  chainStatus: IFinalPostChainInfo[];
  nftDescription: string;
  nftName: string;
  post: IFile;
  status: TFinalPostStatus;
}

/**
 * /user/final_posts返回的数据
 */
export interface IGetUserFinalpostsData extends IPagerData<IFinalPost> {
  sellerAvatar: IFile;
  sellerId: number;
  sellerName: string;
  sellerShopName: string;
}

export interface IOrderData {
  budgetAmount: string;
  buyerAvatar: IFile;
  buyerCancelAt: number;
  buyerId: number;
  buyerName: string;
  category: string;
  coinId: number;
  comment: string;
  createdAt: number;
  customerServiceReplyAt: number;
  deliverDocs: IFile[];
  deliverTime: number;
  description: string;
  id: number;
  modifyAt: number;
  scope: number;
  sellerAvatar: IFile;
  sellerDeliverAt: number;
  sellerFirstDeliverAt: number;
  sellerId: number;
  sellerName: string;
  sellerReplyAt: number;
  servicePosts: IFile[];
  serviceTitle: string;
  status: string;
  subServiceLevel: number;
  subcategory: string;
  submissionCustomerServiceAt: number;
  txFee: string;
  usdAmount: string;
}
export interface IOrderListRes {
  list: IOrderData[];
  total: number;
}

export interface IUserOrderItem {
  budgetAmount: string;
  buyerAvatar: IFile;
  buyerCancelAt: number;
  buyerId: number;
  buyerName: string;
  category: string;
  coinId: number;
  comment: string;
  createdAt: number;
  customerServiceReplyAt: number;
  deliverDocs?: IFile[];
  deliverTime: number;
  description: string;
  id: number;
  modifyAt: number;
  scope: number;
  sellerAvatar: IFile;
  sellerDeliverAt: number;
  sellerFirstDeliverAt: number;
  sellerId: number;
  sellerName: string;
  sellerReplyAt: number;
  servicePosts?: IFile[];
  serviceTitle: string;
  status: string;
  subServiceLevel: number;
  subcategory: string;
  submissionCustomerServiceAt: number;
  txFee: string;
  txHash: string;
  txChainId: number;
  usdAmount: string;
  proId: number;
  proType: number;
}
export interface IOverview {
  cancelled: number;
  completed: number;
  progress: number;
  review: number;
}

export interface IUserOrder {
  list?: IUserOrderItem[] | null;
  overview?: IOverview;
  total: number;
}

export interface IUserOrderData extends IPagerData<IUserOrderItem> {
  overview?: IOverview;
}
