import { useCallback, useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import Chains, { NetworkChain } from '../chains';
import { DAppWallet, Wallets } from '../wallets';
import { defChain } from '../define';
import { useModel } from 'umi';
import Web3 from 'web3';
// import Web3 from 'web3';

export const useWalletConnection = () => {
  let [loading, setLoading] = useState<boolean>(false);
  const { activate, active, deactivate } = useWeb3React();
  const { walletName, setWalletName } = useModel('general');
  const { handleSwitch } = useChainCheck();
  const connect = (name: DAppWallet = DAppWallet.MetaMask) => {
    // if (loading) {
    //   return Promise.reject();
    // }
    // setLoading((loading = true));
    return activate(Wallets[name](), (error) => {
      handleSwitch();
    }).then((res) => {
      console.log('Connect:', name);
      setWalletName(name);
      // setTimeout(() => {
      //   setLoading((loading = false));
      // }, 200);
    });
  };
  const disconnect = () => {
    sessionStorage.clear();
    setWalletName();
    deactivate();
  };

  useEffect(() => {
    if (walletName) {
      setTimeout(() => {
        connect(DAppWallet.MetaMask);
      }, 200);
    }
  }, [walletName]);

  return {
    loading,
    connect,
    disconnect,
  };
};

export const useChainCheck = () => {
  const { chainId, library, error, active } = useWeb3React();

  const handleSwitch = useCallback(
    async (_chainId: NetworkChain = defChain, callback?: () => void) => {
      const provider = library?._provider || Web3.givenProvider;
      // if (!provider || !chainId || !NetworkChain[chainId]) {
      //   return;
      // }
      try {
        await provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: Chains[_chainId]?.chainId }],
        });
      } catch (error: any) {
        if (error?.code === 4001) {
          return callback?.();
        }
        try {
          await provider.request({
            method: 'wallet_addEthereumChain',
            params: [Chains[_chainId]],
          });
        } catch (addError) {}
      }
    },
    [chainId, library, error],
  );
  return {
    handleSwitch,
  };
};

export const useInitWeb3 = () => {
  const { chainId, account, library } = useWeb3React();

  useEffect(() => {
    console.log('-------------------------------', account, chainId);
    library?.currentProvider?.on('accountsChanged', (accounts: string[]) => {
      if (account !== accounts[0]) {
        location.reload();
      }
    });

    library?.currentProvider?.on('chainChanged', (chains: string[]) => {});
  }, [chainId, account, library]);

  return null;
};
