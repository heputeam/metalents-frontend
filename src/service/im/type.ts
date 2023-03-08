import { IFile } from '@/types';

export interface ICloumnInfoItem {
  avatar: IFile;
  id: number;
  isVerify: string;
  userName: string;
  userType: number;
}

export interface ICloumnInfo {
  list: ICloumnInfoItem[];
  total: number;
}
