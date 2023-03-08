import { useWeb3React } from '@web3-react/core';
import { useCallback, useEffect, useState } from 'react';
import BigNumber from 'bignumber.js';
import { Erc20Contract } from '@/web3/contract';
import { fromWei } from '@/utils';
import { Params } from 'ahooks/lib/usePagination/types';
import { usePagination } from 'ahooks';
import { IPagerData } from '@/service/types';
import { IHistories } from '@/service/wallet/types';
import { getWalletHistories } from '@/service/wallet';
import { PAGE_SIZE } from '@/pages/request/_define';
import { ZERO_TOEKN } from '@/web3/define';

export const useBalance = (contractAddress: string) => {
  const { account, library } = useWeb3React();
  const [balance, setBalance] = useState<number>();

  const getBalance = useCallback(async () => {
    if (!account || !contractAddress) return;
    if (contractAddress === '0x0000000000000000000000000000000000000000') {
      const _balance = await library?.eth.getBalance(account);
      setBalance(fromWei(_balance).toNumber());
    } else {
      const _balance = await Erc20Contract(library, contractAddress)
        .methods.balanceOf(account)
        .call();
      setBalance(fromWei(new BigNumber(_balance)).toNumber());
    }
  }, [account, contractAddress]);

  useEffect(() => {
    if (!contractAddress) return;
    getBalance();
  }, [account, library, contractAddress]);

  return { balance, getBalance };
};

export const useApprove = (contractAddress: string) => {
  const { library, active, account } = useWeb3React();
  const [approve, setApprove] = useState<boolean>(false);
  const getApprove = async () => {
    if (!active || !account || !contractAddress) return;
    if (contractAddress === ZERO_TOEKN) return;
    setApprove(false);
    Erc20Contract(library, contractAddress)
      .methods.allowance(account, contractAddress)
      .call()
      .then((res) => {
        setApprove(Number(res) > 0);
      })
      .catch((error) => {
        console.log('allowance--err--', error);
      });
  };
  useEffect(() => {
    getApprove();
  }, [contractAddress]);
  return {
    approve,
    getApprove,
  };
};

export const useTransactionHistory = ({ dateFilter, transType }: any) => {
  return usePagination<IPagerData<IHistories>, Params>(
    async ({ current }) => {
      const response = await getWalletHistories({
        startTime: dateFilter.startTime,
        endTime: dateFilter.endTime,
        offset: (current - 1) * PAGE_SIZE,
        pageSize: PAGE_SIZE,
        tradeType: transType,
      });
      return {
        total: response.data.total || 0,
        list: response.data.list ?? [],
      };
    },
    {
      refreshDeps: [dateFilter, transType],
    },
  );
};
