export interface IConfig {
  [key: string]: IConfigItem;
}
export interface IConfigItem {
  cfgComment: string;
  cfgName: string;
  cfgVal: string;
  id: number;
  status: number;
}
