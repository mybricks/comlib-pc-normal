import { ListGridType } from 'antd/lib/list';

export enum InputIds {
  DATA_SOURCE = 'dataSource',
  LOADING = 'loading',
  GetDataSource = 'getdataSource',
  AddItem = 'addItem',
  RemoveItem = 'removeItem',
  ChangeItem = 'changeItem',
  MoveUp = 'moveUp',
  MoveDown = 'moveDown'
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

export interface Option {
  point: number;
  relation: string; 
  columns: number;
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

  //响应式布局
  isResponsive: boolean;
  //List断点列数
  bootstrap: number[];
  //横向滚动，列表项宽度
  itemWidth: any;
  //自定义断点
  isCustomPoints: boolean;
  //断点配置
  customOptions: Option[];
}

