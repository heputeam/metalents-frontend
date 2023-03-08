import axios from 'axios';
import { apis } from '..';

export function getWalletBalances(): any {
  return axios.get(apis.wallet.balances, { params: {} });
}

export function getWalletHistories(params: any): any {
  return axios.post(apis.wallet.histories, { ...params });
}

export function getWalletPayment(
  amount: string,
  coinId: number,
  paymentType: number,
  verifyCode: string,
): any {
  return axios.post(apis.wallet.payment, {
    amount,
    coinId,
    paymentType,
    verifyCode,
  });
}

export function postWalletWithdraw(
  address: string,
  amount: string,
  coinId: number,
  verifyCode: string,
): any {
  return axios.post(apis.wallet.withdraw, {
    address,
    amount,
    coinId,
    verifyCode,
  });
}
