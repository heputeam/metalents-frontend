export interface IActivityListParams {
  endAt?: number;
  startAt?: number;
  status?: string;
  title?: string[];
}

export interface IActivityList {
  list: [
    {
      createAt: number;
      description: string;
      endAt: number;
      id: number;
      image: string;
      modifyAt: number;
      startAt: number;
      status: string;
      title: string;
    },
  ];
  total: number;
}

export interface IActivityParams {
  activityId: number;
}

export interface IActivityConfigItem {
  activityId: number;
  cfgName: string;
  cfgVal: string;
  status: string;
}

export interface IActivityConfig {
  list: IActivityConfigItem[];
  total: number;
}

export interface ITopSellerItem {
  sellerId: number;
  sellerName: string;
  totalPoints: number;
}
export interface ITopSeller {
  list: ITopSellerItem[];
  total: number;
}

export interface IRewardsItem {
  coinPrice: string;
  createdAt: number;
  modifyAt: number;
  pointType: string;
  points: number;
}
export interface IRewards {
  list: IRewardsItem[];
  total: number;
}

export enum ACTIVITY_TYPE {
  'order_completed' = 'Order Completion',
  'withdraw' = 'Withdrawal',
  'order_first_completed' = 'First Order Completion',
  'referred_done_order' = 'Referral`s Order Completion',
  'referred_register' = 'Referral`s Verification',
  'verify' = 'Verification',
  'twitter_share' = 'Sharing on Twitter',
}

export interface IReferralsItem {
  completedOrder: number;
  isVerify: string;
  registrationAt: number;
  sellerId: number;
  sellerName: string;
  totalReward: number;
}
export interface IReferrals {
  list: IReferralsItem[];
  total: number;
}

export interface IDashboard {
  availablePoints: number;
  completedOrder: number;
  referralCompletedOrder: number;
  referralCount: number;
  referralVerifyCount: number;
  totalPoints: number;
}

export interface IWithdraw {
  coinPrice: string;
  createdAt: number;
  modifyAt: number;
  points: number;
  success: boolean;
}
