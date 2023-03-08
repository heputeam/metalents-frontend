import { IFile } from '@/types';

export interface IResOrderList {
  list: {
    budgetAmount: string;
    buyerId: number;
    category: string;
    coinId: number;
    createdAt: number;
    deliverDocs: string;
    deliverTime: number;
    level: number;
    scope: number;
    status: number;
    subCategory: string;
    userAvatar: string;
    userName: string;
  }[];
  totle: number;
}

export interface IServicesOrdersItem {
  budgetAmount: string;
  buyerId: number;
  category: string;
  coinId: number;
  createdAt: number;
  deliverDocs: IFile[];
  deliverTime: number;
  level: number;
  scope: number;
  status: string;
  subCategory: string;
  userAvatar: IFile;
  userName: string;
  txHash: string;
  txChainId: number;
}

export interface IServicesOrders {
  list: IServicesOrdersItem[];
  total: number;
}
