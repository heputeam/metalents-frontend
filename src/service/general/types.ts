import { IFile } from '@/types';
import { ISubServiceInfo } from '../services/types';
import { IPagerRequest } from '../types';

export interface ISearchServicesParams extends IPagerRequest {
  userId: number;
  sortType: string;
}

export interface ISearchServiceParams {
  avgScope?: string;
  budgetMax?: string;
  budgetMin?: string;
  coinId?: number[];
  category?: string;
  deliverTime?: number;
  keyword?: string;
  offset: number;
  optionIds?: number[];
  pageSize: number;
  sortType?: string;
  subcategory?: string;
  userId?: number;
}

export interface IService {
  category: string;
  createdAt: number;
  description: string;
  followed: number;
  id: number;
  inQueue: number;
  isFollowing: true;
  postids: string;
  posts: IFile[];
  scope: number;
  sellerLevels: number;
  shopname: string;
  status: number;
  subServices: ISubServiceInfo[];
  subcategory: string;
  title: string;
  total: number;
  totalAmount: string;
  userAvatar: IFile;
  userId: number;
  userName: string;
  sellerIsVerify: 'verified' | string;
}

export interface IBanner {
  list?: IBannerItem[] | null;
}
export interface IBannerItem {
  background: string;
  id: number;
  title: string;
  url: string;
}

export interface ISearchRequests {
  list?: ISearchRequestsItem[] | null;
  total: number;
  waitingCount: number;
}
export interface ISearchRequestsItem {
  avatar: string;
  budgetAmount: string;
  category: string;
  coinId: number;
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

export interface IOrderReasonRes {
  list?: IOrderReasons[] | null;
  total: number;
}
export interface IOrderReasons {
  id: number;
  reason: string;
  reasonType: string;
  status: string;
}

export interface IFileConfig {
  [key: string]: IFileConfigItem;
}
export interface IFileConfigItem {
  id: number;
  postType: number;
  relateService: string;
  fileExt: string;
  fileMaxSize: number;
  fileCount: number;
  status: number;
}
