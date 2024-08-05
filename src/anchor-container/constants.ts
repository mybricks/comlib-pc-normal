
export enum InputIds {
  DATA_SOURCE = 'dataSource',
  LOADING = 'loading',
  SET_ACTIVE_ANCHOR = 'setActiveAnchor'
}
export enum OutputIds {
  GetDataSource = 'getdataSource'
}

export type AnchorPosition = 'left' | 'right';

export const Schemas = {
  Array: {
    type: 'array',
    items: {
      title: '列表数据',
      type: 'any'
    }
  }
};

export interface Option {
  _id: string;
  id: string;
  title: string;
}

export interface Data {
  //数据源
  dataSource: any[];
  staticData: any[];
  useDynamicData: boolean;
  enableFix: boolean;
  //加载中动画
  useLoading?: boolean;
  //加载中文案
  loadingTip?: string;
  anchorPosition: AnchorPosition;
  hideAnchorList?: boolean
}
