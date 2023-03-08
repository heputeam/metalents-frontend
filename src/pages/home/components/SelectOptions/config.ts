export interface ICheckBoxConfig {
  name: string;
  value: string;
  checked: boolean;
  id?: number;
}

// 1: 销量高到低, 2: 销量低到高, 3: 卖家等级高到低, 4: 卖家等级低到高, 5: 服务评价高到低, 6: 服务评价低到高,
// 7: 创建时间升序, 8:创建时间倒序, 9: 按照价格降序, 10: 按照价格升序, 11: 验证用户优先, 12: 未验证用户优先 默认：11
export enum ESortBy {
  salesVolumelHighToLow = 'order_count_desc',
  salesVolumelLowToHigh = 'order_count_asc',
  sellerLevelHighToLow = 'user_level_desc',
  sellerLevelLowToHigh = 'user_level_asc',
  serviceStarsHighToLow = 'service_scope_desc',
  serviceStarsLowToHigh = 'service_scope_asc',
  createTimeHighToLow = 'create_time_desc',
  createTimeLowToHigh = 'create_time_asc',
  servicePriceHighToLow = 'budget_amount_desc',
  servicePriceLowToHigh = 'budget_amount_asc',
  sellerRecommendFirst = 'verify_asc',
  sellerRecommendLast = 'verify_desc',
}

export interface ISortByConfig {
  context: string;
  value: ESortBy;
}

export const FilterStarConfig: ICheckBoxConfig[] = [
  {
    name: 'services_3star',
    value: 'Only services > 3 stars',
    checked: false,
  },
];

export const SoryByConfig: ISortByConfig[] = [
  {
    context: 'Recommend',
    value: ESortBy.sellerRecommendFirst,
  },
  {
    context: 'Best Selling',
    value: ESortBy.salesVolumelHighToLow,
  },
  {
    context: 'Price from high to low',
    value: ESortBy.servicePriceHighToLow,
  },
  {
    context: 'Price from low to high',
    value: ESortBy.servicePriceLowToHigh,
  },
  {
    context: 'Stars range from high to low',
    value: ESortBy.serviceStarsHighToLow,
  },
  {
    context: 'Seller level from high to low',
    value: ESortBy.sellerLevelHighToLow,
  },
];
