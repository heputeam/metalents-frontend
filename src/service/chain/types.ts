/**
 * /chain/ar_apply的参数
 */
export interface IPostArApplyParams {
  orderId: number;
  postId: number;
}

/**
 * /chain/ar_apply返回的数据
 */
export interface IPostArApplyData {
  success: boolean;
}

/**
 * /chain/mint_nft的参数
 */
export interface IPostGetMintSignParams {
  chainId: number;
  mintAddress: string;
  postId: number;
  orderId: number;
}

/**
 * /chain/mint_nft返回的数据
 */
export interface IPostGetMintSignData {
  expireTime: number;
  sign: string;
}

/**
 * /chain/update_post的参数
 */
export interface IPostUpdatePostParams {
  nftDescription: string;
  nftName: string;
  postId: number;
}

/**
 * /chain/update_post返回的数据
 */
export interface IPostUpdatePostData {
  success: boolean;
}

/**
 * /chain/mint_nft的参数
 */
export interface IPostMintNftParams {
  chainId: number;
  postId: number;
  txHash: string;
}

/**
 * /chain/mint_nft返回的数据
 */
export interface IPostMintNftData {
  success: boolean;
}
