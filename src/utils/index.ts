import { FileAcceptType } from '@/components/Uploader/mimeTypes';
import { IActivityConfig, IActivityConfigItem } from '@/service/invite/type';
import { ISubServiceInfo, ITokens } from '@/service/services/types';
import BigNumber from 'bignumber.js';
// import moment from 'moment';
// import 'moment-precise-range-plugin';

// 格式化数字千分位
export function toThousands(num: number | string, decimals?: number) {
  let tempNum;
  if (num && decimals) {
    tempNum =
      Math.floor(Number(num) * Math.pow(10, decimals)) / Math.pow(10, decimals);
  }
  const strs = (tempNum || num || 0).toString().split('.');
  return strs[1]
    ? `${strs[0].replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')}.${strs[1]}`
    : `${strs[0].replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')}`;
}
// 格式化数字转化为k
export function toDigitalFormat(num: number | string) {
  return Number(num) >= 1e3 ? `${(Number(num) / 1e3).toFixed(1)}k` : num;
}

// account 地址缩写
export function toOmitAccount(account: string) {
  if (account.length <= 10) return account;
  return `${account?.substr(0, 6)}...${account?.substr(
    account?.length - 4,
    4,
  )}`;
}
// 去精度
export const fromWei = (value: BigNumber, decimals: number = 18) => {
  return new BigNumber(value).dividedBy(new BigNumber(10).pow(decimals));
};
// 加精度
export const toWei = (value: number, decimals: number = 18) => {
  return new BigNumber(value).multipliedBy(new BigNumber(10).pow(decimals));
};

export const toHex = (value: string | number) => {
  const str = parseInt(value as string).toString(16);
  return `0x${str.length > 1 ? str : `0${str}`}`;
};

export const toFixzero = (s: number | string, size: number) => {
  s = s.toString();
  if (s.length === size) return s;
  var dest = '';
  for (var i = 0; i < size - s.length; i++) {
    dest += '0';
  }
  return dest + s;
};

export const toTime = (value: string | number) => {
  const time = Number(value);
  const h = time / 3600; // 小时
  const m = (time % 3600) / 60; //分钟
  const s = (time % 3600) % 60;
  return [h, m, s].map((v) => toFixzero(parseInt(v.toString()), 2));
};

export const lowPriceToken = (
  subServices: ISubServiceInfo[],
  tokens: ITokens,
) => {
  const resultList: {
    budgetAmount: string;
    budgetToken: string;
    totalPrice: number;
  }[] = [];
  if (tokens && subServices) {
    subServices
      ?.filter((v) => v.status === 1 && v.level === 1)
      ?.forEach((item1) => {
        Object.keys(tokens)?.forEach((item2) => {
          if (item1?.coinId === tokens[item2]?.id) {
            const tempObj = {
              budgetAmount: item1.budgetAmount,
              budgetToken: tokens[item2]?.name?.toUpperCase(),
              totalPrice:
                Number(item1.budgetAmount) * Number(tokens[item2]?.price),
            };
            resultList.push(tempObj);
          }
        });
      });
    resultList.sort((a, b) => {
      return a.totalPrice - b.totalPrice;
    });
    return resultList?.[0];
  }
};

// 获取指定代币可以显示的小数位
export const getTokenSysDecimals = (coinId: number, tokens: ITokens) => {
  if (tokens && coinId) {
    const tokenKey: string[] = Object.keys(tokens)?.filter(
      (item) => tokens?.[item]?.id === coinId,
    );
    const decimal = tokens[tokenKey?.[0]]?.sysDecimals;
    return decimal;
  }
};

// 小数舍尾
export const numberDecimal = (val: string | number, decimal: number) => {
  const tempToWei = toWei(Number(val), decimal).toNumber();
  const tempFromWei = toWei(1, decimal).toNumber();
  return Math.floor(tempToWei) / tempFromWei;
};

// 根据coinId获取token
export const getCurrentToken = (coinId: number, tokens: ITokens) => {
  if (coinId && tokens) {
    const tokenKey: string[] = Object.keys(tokens)?.filter(
      (item) => tokens?.[item]?.id === coinId,
    );
    return tokens[tokenKey?.[0]];
  }
};

// // 计算两个时间剩余的倒计时
// export const getLeftTime = (startTime: number, endTime: number): ILeftTimeDiff => {
//   // @ts-ignore
//   return moment?.preciseDiff(startTime, endTime, true)
// }

//
export const getfilesize = (size: number): string => {
  if (!size) return '0KB';

  var num = 1024; //byte

  if (size < num) return size + 'B';
  if (size < Math.pow(num, 2)) return (size / num).toFixed(0) + 'KB'; //kb
  if (size < Math.pow(num, 3))
    return (size / Math.pow(num, 2)).toFixed(0) + 'MB'; //M
  if (size < Math.pow(num, 4))
    return (size / Math.pow(num, 3)).toFixed(0) + 'GB'; //G
  if (size < Math.pow(num, 5))
    return (size / Math.pow(num, 4)).toFixed(0) + 'TB'; //T

  return size + 'B';
};

// 文件大小字节转成M
export const getFileMaxSize = (size: number): number => {
  if (!size) return 0;
  var num = 1024 * 1024; // byte
  return new BigNumber(size).dividedBy(num).toNumber();
};

// 获取邀请活动的配置项的值
export const getConfigItem = (
  configData: IActivityConfig,
  activityId: number,
  name: string,
) => {
  if (configData && activityId && name) {
    const activityData = configData?.filter(
      (item: IActivityConfigItem) =>
        item?.activityId === activityId && item?.status === 'enable',
    );
    if (activityData?.length > 0) {
      const item = activityData?.filter(
        (item: IActivityConfigItem) => item?.cfgName === name,
      );
      return item?.[0];
    }
  }

  return null;
};

// 判断是否是移动端
export const hasMobile = (): boolean => {
  return !!(
    navigator.userAgent.match(/Mobi/i) ||
    navigator.userAgent.match(/Android/i) ||
    navigator.userAgent.match(/iPhone/i)
  );
};

// 获取光标位置
export const getCursorForTextArea = (dom: {
  selectionStart: number;
  selectionEnd: number;
}) => {
  let position = {
    start: 0,
    end: 0,
  };
  if (dom.selectionStart) {
    position.start = dom.selectionStart;
  }
  if (dom.selectionEnd) {
    position.end = dom.selectionEnd;
  }
  return position;
};

// 转换文件上传支持的格式
export const acceptFileType = (initType: string) => {
  if (!initType) {
    return [''];
  }
  const initTypeList = initType.split(',');
  const resultType = initTypeList.map((item) => FileAcceptType[item]);
  return resultType;
};
