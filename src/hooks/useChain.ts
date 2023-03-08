import {
  postArApply,
  postGetMintSign,
  postMintNft,
  postUpdatePost,
} from '@/service/chain';
import {
  IPostArApplyData,
  IPostArApplyParams,
  IPostGetMintSignData,
  IPostGetMintSignParams,
  IPostMintNftData,
  IPostMintNftParams,
  IPostUpdatePostData,
  IPostUpdatePostParams,
} from '@/service/chain/types';
import { IResponse } from '@/service/types';
import { useRequest } from 'ahooks';
import { Options } from 'ahooks/lib/useRequest/src/types';

export const usePostArApply = (options?: Options<any, any>) =>
  useRequest<IResponse<IPostArApplyData>, [IPostArApplyParams]>(
    (params) => postArApply(params),
    { manual: true, ...options },
  );

export const usePostGetMintSign = (
  options?: Options<IResponse<IPostGetMintSignData>, [IPostGetMintSignParams]>,
) =>
  useRequest<IResponse<IPostGetMintSignData>, [IPostGetMintSignParams]>(
    (params) => postGetMintSign(params),
    {
      manual: true,
      ...options,
    },
  );

export const usePostUpdatePost = (options?: Options<any, any>) =>
  useRequest<IResponse<IPostUpdatePostData>, [IPostUpdatePostParams]>(
    (params) => postUpdatePost(params),
    {
      manual: true,
      ...options,
    },
  );

export const usePostMintNft = (
  options?: Options<IResponse<IPostMintNftData>, [IPostMintNftParams]>,
) =>
  useRequest<IResponse<IPostMintNftData>, [IPostMintNftParams]>(
    (params) => postMintNft(params),
    {
      manual: true,
      ...options,
    },
  );
