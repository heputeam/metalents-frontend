export interface IBalances {
  balances?: IBalancesItem[] | null;
  overview: Overview;
}
export interface IBalancesItem {
  amount: string;
  coinId: string;
  freezeAmount: string;
}
export interface Overview {
  freezeIncome: string;
  totalIncome: string;
  weekIncome: string;
}

export interface IHistories {
  list?: IHistoriesItem[] | null;
  total: number;
}
export interface IHistoriesItem {
  amount: string;
  coinId: number;
  createdAt: number;
  fee: string;
  id: number;
  modifyAt: number;
  status: number;
  tradeType: number;
  txHash: string;
  txOrder: number;
  usdAmount: string;
}
