import { IFile } from '@/types';
import { IMenuOptions } from '../public/types';

// 服务状态
export enum ServiceStatus {
  LIVE = 1,
  PAUSE = 2,
  CLOSE = 3,
  DELETE = 4,
}

// 创建主服务请求参数
export interface ICreateMainServiceParams {
  category: string;
  description: string;
  id: number;
  optionIds: [number];
  posts: IFile[];
  subcategory: string;
  title: string;
}

// 创建主服务返回
export interface IMainServiceRes {
  category: string;
  createdAt: number;
  description: string;
  id: number;
  modifyAt: number;
  options: IMenuOptions[];
  posts: IFile[];
  status: number;
  subcategory: string;
  title: string;
  userId: number;
}
// 1:on, 2:off
export type ISubServiceStatus = 1 | 2;
// 1: basic, 2: standard, 3: premium
export type ISubServiceLevel = 1 | 2 | 3;
export interface ISubServiceInfo {
  budgetAmount: string;
  coinId: number;
  deliverTime: number;
  finalDocs: string;
  revisions: number;
  level: ISubServiceLevel;
  status: ISubServiceStatus;
  serviceId?: number;
  id?: number;
}

// 创建子服务请求参数
export interface ISubServiceParams {
  serviceId: number;
  subServices: ISubServiceInfo[];
}

export interface IServiceList {
  category: string;
  createdAt: number;
  description: string;
  followed: number;
  id: number;
  inQueue: number;
  isFollowing: true;
  posts: IFile[];
  scope: number;
  status: number;
  subServices: ISubServiceInfo[];
  subcategory: string;
  title: string;
  total: number;
  totalAmount: string;
  userId: number;
}

// my service list
export interface IUserServiceInfo {
  total: number;
  list: IServiceList[] | null;
  overview: {
    total: number;
    pause: number;
    close: number;
    delete: number;
    live: number;
  };
}

export interface IStatusOrder {
  canceled: number;
  finished: number;
  id: number;
  inQueue: number;
}
export interface IMainServiceOrderProps {
  list: IStatusOrder[] | null;
  total: number;
}

export interface ITokensItem {
  asBond: number;
  avatar: string;
  decimals: number;
  status: number; // 生效状态 1： 生效， 2： 禁用
  id: number;
  name: string;
  network: string;
  price: string;
  symbol: string;
  sysDecimals: number;
  sysFee: string;
}

export type ITokens = {
  [key: string]: ITokensItem;
};

export interface IGetServiceDetailParams {
  serviceId: number;
}
