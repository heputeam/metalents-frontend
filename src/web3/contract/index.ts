import { initContract } from './helpers';

import Erc20Abi from '../abis/erc20.json';
import MetalentsCreationNFT from '../abis/MetalentsCreationNFT.json';
import { Erc20 as IErc20 } from '../types/Erc20';
import { MetalentsCreationNFT as IMetalentsCreationNFT } from '../types/MetalentsCreationNFT';

export * from './helpers';

export const Erc20Contract = initContract<IErc20>(Erc20Abi.abi);

export const CreationNFTContract = initContract<IMetalentsCreationNFT>(
  MetalentsCreationNFT.abi,
);
