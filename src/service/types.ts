export * from './user';

export interface IResquest {}

export interface IResponse<TData> {
  code: number | string;
  msg: string;
  data: TData;
}

export interface IPagerRequest {
  offset: number;
  pageSize: number;
}

export interface IPagerData<TData> {
  list: TData[];
  total: number;
}

export type IPageResponse<TData> = IResponse<IPagerData<TData>>;

export type IPageParams<TParams> = Omit<TParams, 'offset'> & {
  current: number;
};
