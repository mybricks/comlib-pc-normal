import { ListGridType } from 'antd/lib/list';

export enum InputIds {
  DATA_SOURCE = 'dataSource',
  LOADING = 'loading',
  GetDataSource = 'getdataSource'
}
export enum OutputIds {
  GetDataSource = 'getdataSource',
  SortComplete = 'sortComplete'
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

export interface Data {
  //数据源
  dataSource: any[];
  //获取列表数据
  useGetDataSource?: boolean;

  //加载中动画
  useLoading?: boolean;
  //加载中文案
  loadingTip?: string;

  //是否自动换行
  isAuto?: boolean;
  //是否横向滚动
  isScroll?: boolean;
  //是否自定义列数
  isCustom?: boolean;
  //列数
  column: number;
  //间隔
  grid: ListGridType & {   //移动端列数
    mobileColumn: number;
  };
  canSort: boolean;

  //自定义rowKey
  rowKey: string;

  //自动换行时，方向
  layout: 'horizontal'|'vertical'
}
