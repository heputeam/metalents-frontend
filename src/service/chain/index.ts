import axios from 'axios';
import { apis } from '..';
import { IResponse } from '../types';
import {
  IPostArApplyData,
  IPostArApplyParams,
  IPostGetMintSignData,
  IPostGetMintSignParams,
  IPostMintNftData,
  IPostMintNftParams,
  IPostUpdatePostData,
  IPostUpdatePostParams,
} from './types';

export function postArApply(
  params: IPostArApplyParams,
): Promise<IResponse<IPostArApplyData>> {
  return axios.post(apis.chain.ar_apply, {
    ...params,
  });
}

export function postGetMintSign(
  params: IPostGetMintSignParams,
): Promise<IResponse<IPostGetMintSignData>> {
  return axios.post(apis.chain.get_mint_sign, {
    ...params,
  });
}

export function postUpdatePost(
  params: IPostUpdatePostParams,
): Promise<IResponse<IPostUpdatePostData>> {
  return axios.post(apis.chain.update_post, {
    ...params,
  });
}

/**
 * 通过合约mint成功后调用此方法
 */
export function postMintNft(
  params: IPostMintNftParams,
): Promise<IResponse<IPostMintNftData>> {
  return axios.post(apis.chain.mint_nft, {
    ...params,
  });
}
