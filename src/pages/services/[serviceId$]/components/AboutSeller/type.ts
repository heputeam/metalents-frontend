import { IMenuInfo } from '@/service/public/types';
import { IFile } from '@/types';

export interface IResUserProfile {
  id: number;
  email: string;
  userName: string;
  shopname: string;
  location: string;
  timezone: string;
  career: string;
  avatar: IFile;
  banner: string;
  company: string;
  description: string;
  focused: number[];
  instagramLink: string;
  twitterLink: string;
  walletAddress: string;
  userBalance: string;
  userType: number;
  levels: number;
  modifyTimes: number;
  modifyLeftTimes: number;
  createdAt: number;
  googleInfo: {
    name: string;
    avatar: string;
  };
  twitterInfo: {
    name: string;
    avatar: string;
  };
  instagramInfo: {
    name: string;
    avatar: string;
  };
  status: number;
  scope: number;
  orderCount: number;
  followerCount: number;
  bond: string;
  isVerify: string;
}

export interface IProfileInfo {
  userInfo: {
    userName: string;
    location: string;
    avatar: string;
    timezone: string;
    targetId: string;
    levels: number;
  };

  career: string;
  company: string;
  description: string;
  scope: number;
  orderCount: number;
  focused: IMenuInfo[];
}
