import { IFile } from '@/types';

export interface IMenuOptions {
  optionId: number;
  optionName: string;
  valueName: string;
}

export interface IMenuChildService {
  id: number;
  serviceColor: string;
  serviceName: string;
  parentId: number;
  sortIndex: number;
  options: IMenuOptions[];
}
export interface IMenuInfo {
  id: number;
  serviceColor: string;
  serviceName: string;
  parentId: number;
  sortIndex: number;
  childServices: IMenuChildService[];
}

export interface ISearchUsers {
  avatar: IFile;
  career: string;
  company: string;
  description: string;
  focused: [number];
  id: number;
  levels: number;
  location: string;
  orderCount: number;
  scope: number;
  shopname: string;
  timezone: string;
  userName: string;
}

export interface ISearchService {
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

export interface ISearchRes {
  services: ISearchService[] | null;
  users: ISearchUsers[] | null;
}
