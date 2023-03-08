import { ISubServiceInfo, ServiceStatus } from '@/service/services/types';
import { UserStatus } from '@/service/user/types';
import { IFile } from '@/types';

export enum ServiceTabs {
  'description' = 'description',
  'comments' = 'comments',
  'transactions' = 'transactions',
}

export interface ISubServices {
  budgetAmount: string;
  budgetToken: string;
  status: number;
  level: number;
}

export interface IResDetail {
  id: number;
  title: string;
  category: string;
  subcategory: string;
  description: string;
  options: any[];
  status: ServiceStatus;
  posts: IFile[];
  subservices: ISubServiceInfo[];
  scope: number;
  following: boolean;
  totalComments: number;
  totalOrders: number;
  userId: number;
  inqueueOrder: number;
}

export interface IResMainService {
  list: {
    canceled: number;
    finished: number;
    id: number;
    inQueue: number;
  }[];
  total: number;
}

export enum ServiceIdType {
  'Basic Service' = 1,
  'Standard Service' = 2,
  'Premium Service' = 3,
}

export enum ServiceLevelType {
  'Basic' = 1,
  'Standard' = 2,
  'Premium' = 3,
}
export interface IService {
  type: ServiceIdType;
  price: string;
  subPrice: string;
  delive: string;
  fina: string;
  document: string;
}

export interface ISellerInfo {
  userId: number;
  avatar: string;
  userName: string;
  shopname?: string;
  isVerify?: string;
  status?: UserStatus;
}

export interface IResFollowService {
  success: boolean;
}
