import { ListGridType } from 'antd/lib/list';

export enum InputIds {
  DATA_SOURCE = 'dataSource',
  LOADING = 'loading'
}
export enum OutputIds {
  GetDataSource = 'getdataSource',
}

export const Schemas = {
  Array: {
    type: 'array',
    items: {
      title: '列表数据',
      type: 'any'
    }
  }
}

export interface Option {
  point: number;
  relation: string;
  columns: number;
}
export interface Data {
  //数据源
  dataSource: any[];
  enableFix: boolean;
  //加载中动画
  useLoading?: boolean;
  //加载中文案
  loadingTip?: string;
}

