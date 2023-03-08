import { IMenuChildService, IMenuInfo } from '@/service/public/types';

// 根据一级菜单和二级菜单， 取所有option
export const getOptionSelect = (
  menuData: IMenuInfo[],
  category: string,
  subcategory: string,
) => {
  const selectFirst = menuData?.filter(
    (item: IMenuInfo) => item?.serviceName === category,
  );
  const initSec: IMenuChildService[] = selectFirst?.[0]?.childServices;
  const initStyleItem = initSec?.filter(
    (item: IMenuChildService) => item?.serviceName === subcategory,
  );
  const initOptions = initStyleItem?.[0]?.options;
  let tempOptionsObj: any = {};
  initOptions?.map((item) => {
    if (!tempOptionsObj?.hasOwnProperty(item?.optionName)) {
      tempOptionsObj = {
        ...tempOptionsObj,
        [item?.optionName]: [item],
      };
    } else {
      tempOptionsObj?.[item?.optionName]?.push(item);
    }
  });
  return tempOptionsObj;
};

// 根据一级菜单，获取所有二级菜单
export const getSubcategorySelect = (
  menuData: IMenuInfo[],
  category: string,
) => {
  const selectFirst = menuData?.filter(
    (item: IMenuInfo) => item?.serviceName === category,
  );
  const initSec: IMenuChildService[] = selectFirst?.[0]?.childServices;
  const secStr: string[] = [];
  const secMenus: any[] = [];
  initSec?.map((item, index) => {
    let temp = {
      label: item?.serviceName,
      value: item?.serviceName,
    };
    secStr.push(item?.serviceName);
    secMenus.push(temp);
  });
  return {
    subserviceStr: secStr,
    subserviceObj: secMenus,
  };
};

// 获取所有一级菜单
export const getCategorySelect = (menuData: IMenuInfo[]) => {
  const firstMenus: any[] = [];
  menuData?.map((item, index) => {
    let temp = {
      label: item?.serviceName,
      value: item?.serviceName,
    };
    firstMenus.push(temp);
  });
  return firstMenus;
};
