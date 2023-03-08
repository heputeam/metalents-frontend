import { IFile } from '@/types';

export interface IRequestApply {
  budgetAmount: string;
  budgetToken: string;
  category: string;
  deliverTime: number;
  description: string;
  posts: IFile[];
  subcategory: string;
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
